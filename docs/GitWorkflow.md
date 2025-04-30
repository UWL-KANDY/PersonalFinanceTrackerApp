# Git Workflow

This document outlines the Git workflow for the Personal Finance Tracker App.

## Workflow Steps

1. **Create a Branch**:
   - For new features, create a branch with the prefix `feature/`:
     ```bash
     git checkout -b feature/<branch-name>
     ```
   - For bug fixes, use the prefix `fix/`:
     ```bash
     git checkout -b fix/<branch-name>
     ```
   - For hotfixes, use the prefix `hotfix/`:
     ```bash
     git checkout -b hotfix/<branch-name>
     ```
   - For improvements or enhancements, use the prefix `improvement/` or `enhancement/`:
     ```bash
     git checkout -b improvement/<branch-name>
     ```

2. **Make Changes**:
   - Edit files and commit changes.
   - Use meaningful commit messages that clearly describe the changes made.

3. **Push Changes**:
   ```bash
   git push origin <branch-name>
   ```

4. **Create a Pull Request**:
   - Open a pull request to merge changes into the appropriate branch:
     - Feature branches should be merged into the `develop` branch.
     - Fix, hotfix, improvement, and enhancement branches should also merge into `develop` first.
   - Request a code review.

5. **Code Review and Approval**:
   - At least two team members must review and approve the pull request before it can be merged.
   - Ensure all tests pass and the code adheres to project standards.

6. **Merge the Pull Request**:
   - After approval, merge the pull request into the `develop` branch.
   - Once all changes in the `develop` branch are finalized and tested, they can be merged into the `main` branch.

7. **Main Branch Protection**:
   - No one can directly merge into the `main` branch without meeting the following criteria:
     - At least two approvals from team members.
     - A thorough review of the changes.

This strategy ensures a clear and organized workflow, maintaining the stability and quality of the `main` branch while allowing for efficient development and collaboration.