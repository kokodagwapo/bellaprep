# Troubleshooting Mapbox Address Autosuggest on GitHub Pages

If the address autosuggest is not working on GitHub Pages, follow these steps:

## Step 1: Verify GitHub Secrets Are Set

1. Go to your repository: `https://github.com/kokodagwapo/bellaprep`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Verify these secrets exist:
   - ✅ `VITE_MAPBOX_API_KEY` (Required)
   - ✅ `VITE_API_KEY` (Required for Gemini)
   - ⚠️ `VITE_OPENAI_API_KEY` (Optional)

**Important**: Secret names are **case-sensitive** and must match exactly:
- ✅ Correct: `VITE_MAPBOX_API_KEY`
- ❌ Wrong: `VITE_MAPBOX_API_key` or `MAPBOX_API_KEY`

## Step 2: Check GitHub Actions Build Logs

1. Go to your repository → **Actions** tab
2. Click on the latest workflow run
3. Look for the **"Verify API Keys"** step
4. Check the output:
   - ✅ Should show: `✅ VITE_MAPBOX_API_KEY is set (length: XX)`
   - ❌ If it shows: `❌ VITE_MAPBOX_API_KEY is not set` → The secret is missing

## Step 3: Verify Mapbox API Key Format

Your Mapbox API key should:
- Start with `pk.eyJ...`
- Be a **public access token** (not a secret token)
- Have the following scopes enabled:
  - ✅ `styles:read`
  - ✅ `fonts:read`
  - ✅ `datasets:read`
  - ✅ `geocoding:read`

To check your token:
1. Go to: https://account.mapbox.com/access-tokens/
2. Find your token and verify it's active
3. Click on the token to see its scopes

## Step 4: Check Browser Console

After deployment, open your site: `https://kokodagwapo.github.io/bellaprep/`

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for these messages:
   - ✅ `✅ Mapbox API key loaded successfully` → Key is working
   - ❌ `❌ Mapbox API key not found` → Key is missing or not embedded

## Step 5: Common Issues and Fixes

### Issue: "Mapbox API key not found" in console

**Possible causes:**
1. Secret not set in GitHub
2. Secret name is misspelled
3. Build didn't include the secret

**Fix:**
1. Re-add the secret in GitHub Settings
2. Make sure the name is exactly `VITE_MAPBOX_API_KEY`
3. Trigger a new build by pushing a commit

### Issue: Autosuggest dropdown doesn't appear

**Possible causes:**
1. Mapbox API key is invalid
2. API key doesn't have correct scopes
3. Network/CORS issues

**Fix:**
1. Verify the API key is valid at https://account.mapbox.com/access-tokens/
2. Check browser console for CORS or API errors
3. Try the key in a test environment

### Issue: "Type in 2 or more characters" message but no suggestions

**Possible causes:**
1. API key is set but invalid
2. Mapbox account has usage limits reached
3. Network connectivity issues

**Fix:**
1. Check Mapbox account dashboard for usage/limits
2. Verify API key is active and not expired
3. Check browser network tab for failed requests

## Step 6: Manual Verification

To verify the API key is embedded in the build:

1. After deployment, visit: `https://kokodagwapo.github.io/bellaprep/`
2. Open DevTools → **Sources** tab
3. Find the main JavaScript bundle (usually `index-*.js`)
4. Search for `VITE_MAPBOX_API_KEY` or `pk.eyJ`
5. If found → Key is embedded ✅
6. If not found → Build didn't include the secret ❌

## Step 7: Re-deploy After Fixing Secrets

If you've added or updated secrets:

1. Go to **Actions** tab
2. Click **"Run workflow"** → **"Run workflow"** (manual trigger)
3. Or push a new commit to trigger automatic deployment
4. Wait for the build to complete
5. Clear browser cache and test again

## Quick Checklist

- [ ] `VITE_MAPBOX_API_KEY` secret exists in GitHub Settings
- [ ] Secret name is exactly `VITE_MAPBOX_API_KEY` (case-sensitive)
- [ ] Mapbox API key starts with `pk.eyJ...`
- [ ] Mapbox API key has correct scopes enabled
- [ ] GitHub Actions build completed successfully
- [ ] Browser console shows "✅ Mapbox API key loaded successfully"
- [ ] Browser cache cleared after deployment

## Still Not Working?

If after following all steps the issue persists:

1. **Check GitHub Actions logs** for the "Verify API Keys" step output
2. **Check browser console** for specific error messages
3. **Verify Mapbox account** is active and has available quota
4. **Test locally** with the same API key to ensure it works
5. **Contact support** with:
   - Screenshot of GitHub Secrets page (hide actual key values)
   - Screenshot of browser console errors
   - Link to the deployed site

## Testing Locally

To verify your API key works:

1. Create/update `.env` file:
   ```
   VITE_MAPBOX_API_KEY=pk.eyJ...your-key-here
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Test address autosuggest - if it works locally but not on GitHub Pages, the issue is with GitHub Secrets configuration.

