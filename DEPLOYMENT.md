# Deployment Guide for Render

This guide will help you deploy the Project Management System backend to Render.

## Environment Variables for Render

Set the following environment variables in your Render dashboard:

### Required Environment Variables

```
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Environment Variable Descriptions

- **PORT**: Port number for the server (Render will override this automatically)
- **NODE_ENV**: Set to "production" for production deployment
- **MONGO_URI**: MongoDB Atlas connection string
- **JWT_SECRET**: A long, random string for JWT token signing
- **CLIENT_URL**: URL of your deployed frontend (e.g., Vercel, Netlify)

## Render Deployment Steps

1. **Connect GitHub Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select the repository

2. **Configure Build Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x or higher

3. **Set Environment Variables**:
   - Add all the environment variables listed above
   - Make sure to use your actual MongoDB Atlas URI and a secure JWT secret

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create Cluster**:
   - Create a new cluster (M0 Sandbox is free)
   - Choose your preferred region

3. **Database User**:
   - Go to "Database Access"
   - Create a new database user with read/write permissions

4. **Network Access**:
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for all IPs, or specific IPs for security)

5. **Connection String**:
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your database user password

## Frontend Deployment (Vercel)

1. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set build settings:
     - **Framework Preset**: Create React App
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

2. **Environment Variables**:
   - Add `REACT_APP_API_URL` with your Render backend URL
   - Example: `REACT_APP_API_URL=https://your-app-name.onrender.com`

3. **Update Frontend API Calls**:
   - The frontend is already configured to use the proxy in development
   - For production, update axios base URL to use `process.env.REACT_APP_API_URL`

## Testing Deployment

1. **Backend Health Check**:
   - Visit `https://your-app-name.onrender.com/health`
   - Should return: `{"message": "Project Management API is running!"}`

2. **Frontend**:
   - Visit your Vercel URL
   - Try logging in with the demo account or create a new account

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check MongoDB Atlas connection string
   - Ensure database user has correct permissions
   - Verify network access settings

2. **CORS Errors**:
   - Make sure CLIENT_URL is set correctly in backend environment variables
   - Check that frontend URL matches exactly

3. **Build Failures**:
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility

### Environment Variable Checklist

- [ ] PORT is set (Render handles this automatically)
- [ ] NODE_ENV is set to "production"
- [ ] MONGO_URI is set with correct MongoDB Atlas connection string
- [ ] JWT_SECRET is set with a secure random string
- [ ] CLIENT_URL is set to your deployed frontend URL

## Security Notes

- Never commit .env files to version control
- Use strong, unique JWT secrets in production
- Restrict MongoDB Atlas network access to specific IPs when possible
- Regularly rotate JWT secrets and database passwords
- Use HTTPS for all production URLs

## Support

If you encounter issues during deployment, check:
- Render build logs for backend issues
- Vercel build logs for frontend issues
- Browser console for client-side errors
- Network tab for API call failures
