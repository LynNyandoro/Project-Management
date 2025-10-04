# Frontend Deployment Guide

This guide will help you deploy the Project Management System frontend to either Render (Static Site) or Vercel.

## Prerequisites

- Backend API deployed and accessible (e.g., on Render)
- GitHub repository with the frontend code
- Account on your chosen deployment platform

## Environment Variables

The frontend requires one environment variable:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url.onrender.com` with your actual backend URL.

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel provides excellent support for React applications with automatic deployments.

#### Steps:

1. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`
   - Make sure to select "Production", "Preview", and "Development"

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like `https://your-app-name.vercel.app`

#### Advantages of Vercel:
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Excellent performance with global CDN
- ✅ Easy custom domain setup
- ✅ Built-in analytics

### Option 2: Deploy to Render (Static Site)

Render offers a free tier for static sites with good performance.

#### Steps:

1. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Name**: Your project name
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `client/build`

3. **Set Environment Variables**:
   - Go to Environment → Add Environment Variable
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com`

4. **Deploy**:
   - Click "Create Static Site"
   - Render will build and deploy your application
   - You'll get a URL like `https://your-app-name.onrender.com`

#### Advantages of Render:
- ✅ Free tier available
- ✅ Simple setup process
- ✅ Good performance
- ✅ Custom domain support

## Testing Your Deployment

After deployment, test the following:

1. **Visit Your Frontend URL**:
   - Navigate to your deployed frontend URL
   - The app should load without errors

2. **Test Authentication**:
   - Try signing up for a new account
   - Try logging in with the demo account:
     - Email: `demo@example.com`
     - Password: `password123`

3. **Test API Connection**:
   - Create a new project
   - Add tasks to the project
   - Verify data is saved and retrieved

4. **Check Browser Console**:
   - Open browser developer tools
   - Look for any CORS or API connection errors
   - Verify API calls are going to the correct backend URL

## Troubleshooting

### Common Issues:

#### 1. CORS Errors
**Error**: `Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy`

**Solution**: 
- Verify `CLIENT_URL` environment variable in your backend matches your frontend URL exactly
- Check that your backend CORS configuration includes your frontend domain

#### 2. API Connection Errors
**Error**: `Network Error` or `Failed to fetch`

**Solutions**:
- Verify `REACT_APP_API_URL` is set correctly in your frontend environment variables
- Check that your backend is running and accessible
- Ensure the backend URL is using HTTPS in production

#### 3. Build Failures
**Error**: Build process fails during deployment

**Solutions**:
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific error messages
- Ensure `REACT_APP_API_URL` is set before building

#### 4. Environment Variable Issues
**Error**: API calls still going to localhost

**Solutions**:
- Verify `REACT_APP_API_URL` is set in your deployment platform
- Check that the variable name starts with `REACT_APP_`
- Redeploy after setting environment variables

### Environment Variable Checklist:

- [ ] `REACT_APP_API_URL` is set to your backend URL
- [ ] Backend URL uses HTTPS in production
- [ ] Environment variable is set for all environments (Production, Preview, Development)
- [ ] No trailing slash in the backend URL

## Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will handle SSL certificates automatically

### Render:
1. Go to your Static Site → Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Render will provision SSL certificates

## Performance Optimization

### Build Optimization:
- The app is already optimized with Create React App
- Production builds are minified and compressed
- Static assets are cached with appropriate headers

### CDN Benefits:
- Vercel: Global CDN with edge locations
- Render: CDN included with static sites

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files to version control
   - Use strong, unique values for production
   - Regularly rotate sensitive values

2. **HTTPS**:
   - Always use HTTPS in production
   - Both Vercel and Render provide free SSL certificates

3. **CORS**:
   - Ensure backend CORS is configured for your frontend domain only
   - Don't use wildcard origins in production

## Monitoring and Analytics

### Vercel:
- Built-in analytics and performance monitoring
- Real-time error tracking
- Performance insights

### Render:
- Basic monitoring and logs
- Uptime monitoring
- Error tracking

## Support

If you encounter issues:

1. **Check Deployment Logs**:
   - Vercel: Go to Functions → View Function Logs
   - Render: Go to your service → Logs

2. **Browser Developer Tools**:
   - Check Console for JavaScript errors
   - Check Network tab for failed API calls
   - Verify environment variables are loaded

3. **Backend Health Check**:
   - Visit `https://your-backend-url.onrender.com/health`
   - Should return: `{"message": "Project Management API is running!"}`

## Next Steps

After successful deployment:

1. **Update Documentation**: Update your README with live URLs
2. **Set Up Monitoring**: Configure error tracking and performance monitoring
3. **Custom Domain**: Set up a custom domain for professional appearance
4. **CI/CD**: Leverage automatic deployments for future updates
5. **Backup**: Ensure your MongoDB Atlas database is backed up

---

**Your frontend is now live and ready to use! 🚀**
