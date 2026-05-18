import { prismaClient } from "./prisma";

interface GitHubInviteResult {
  success: boolean;
  username?: string;
  error?: string;
}

/**
 * Extract owner and repo from GitHub URL
 * Handles both https://github.com/owner/repo and git@github.com:owner/repo formats
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Handle https://github.com/owner/repo format
    if (url.includes("https://")) {
      const match = url.match(/github\.com\/([^/]+)\/([^/\s.]+)/);
      if (match) {
        return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
      }
    }
    // Handle git@github.com:owner/repo format
    if (url.includes("git@github")) {
      const match = url.match(/github\.com[:/]([^/]+)\/([^/\s.]+)/);
      if (match) {
        return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get GitHub access token for a user
 */
async function getGitHubAccessToken(userId: string): Promise<string | null> {
  const account = await prismaClient.account.findFirst({
    where: { userId, providerId: "github" },
  });
  return account?.accessToken || null;
}

/**
 * Get GitHub username for a user
 */
async function getGitHubUsername(userId: string): Promise<string | null> {
  const account = await prismaClient.account.findFirst({
    where: { userId, providerId: "github" },
  });
  return account?.accountId || null; // accountId is the GitHub username
}

/**
 * Invite a user as a collaborator on a GitHub repo
 * Returns the invitation URL if successful
 */
async function inviteGitHubCollaborator(
  projectOwnerAccessToken: string,
  owner: string,
  repo: string,
  username: string
): Promise<{ success: boolean; invitationUrl?: string; error?: string }> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${projectOwnerAccessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "DevSync-AI",
      },
      body: JSON.stringify({
        permission: "push", // Can push to the repo
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || `GitHub API error: ${response.status}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { html_url?: string; invitation_url?: string };

    return {
      success: true,
      invitationUrl: data.html_url || data.invitation_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to invite collaborator",
    };
  }
}

/**
 * Add a user as a collaborator to a GitHub repo
 * This is the main function to call from API routes
 */
export async function addGitHubCollaborator(projectOwnerId: string, userId: string, repoUrl: string): Promise<GitHubInviteResult> {
  // Get project owner's GitHub token
  const ownerToken = await getGitHubAccessToken(projectOwnerId);
  if (!ownerToken) {
    return {
      success: false,
      error: "Project owner has not authenticated with GitHub",
    };
  }

  // Get user's GitHub username
  const username = await getGitHubUsername(userId);
  if (!username) {
    return {
      success: false,
      error: "User has not authenticated with GitHub",
    };
  }

  // Parse repo URL
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return {
      success: false,
      error: "Invalid GitHub repository URL",
    };
  }

  // Invite collaborator on GitHub
  const result = await inviteGitHubCollaborator(ownerToken, parsed.owner, parsed.repo, username);

  return {
    success: result.success,
    username: result.success ? username : undefined,
    error: result.error,
  };
}

/**
 * Add multiple users as collaborators to a GitHub repo
 * Useful for bulk operations like when creating a project from an idea
 */
export async function addGitHubCollaborators(projectOwnerId: string, userIds: string[], repoUrl: string): Promise<GitHubInviteResult[]> {
  return Promise.all(userIds.map((userId) => addGitHubCollaborator(projectOwnerId, userId, repoUrl)));
}
