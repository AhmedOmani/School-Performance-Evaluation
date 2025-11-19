# AWS S3 Setup Guide - Complete Beginner's Tutorial

This guide will walk you through setting up AWS S3 for file storage in your School Performance Evaluation System.

## 📋 Prerequisites
- An email address (to create AWS account)
- 5-10 minutes of time

## 🚀 Step-by-Step Instructions

### Step 1: Create AWS Account

1. Go to [https://aws.amazon.com/](https://aws.amazon.com/)
2. Click **"Create an AWS Account"** (top right)
3. Enter your email address and choose a password
4. Complete the registration process (you'll need to provide payment info, but AWS Free Tier includes 5GB storage for 12 months)
5. Verify your email and phone number

### Step 2: Create an S3 Bucket

1. **Log in to AWS Console**: Go to [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
2. **Search for S3**: In the search bar at the top, type "S3" and click on "S3" service
3. **Create Bucket**:
   - Click the orange **"Create bucket"** button
   - **Bucket name**: Choose a unique name (e.g., `ses-evidence-uploads-yourname` or `school-performance-evidence-2024`)
     - ⚠️ Bucket names must be globally unique across all AWS accounts
     - Use lowercase letters, numbers, and hyphens only
   - **AWS Region**: Choose the closest region to your users (e.g., `us-east-1`, `eu-west-1`, `me-south-1` for Middle East)
   - **Object Ownership**: Keep default "ACLs disabled"
   - **Block Public Access**: 
     - ✅ **Uncheck "Block all public access"** (we'll make files private via signed URLs)
     - Actually, keep it checked for security - we'll use presigned URLs
   - **Bucket Versioning**: Disable (unless you need file versioning)
   - **Default encryption**: Enable (choose "Amazon S3 managed keys")
   - Click **"Create bucket"** at the bottom

### Step 3: Create IAM User (for Application Access)

**Why?** We don't want to use your root AWS account credentials in the app. We'll create a limited user with only S3 upload permissions.

1. **Go to IAM**: Search for "IAM" in AWS Console
2. **Create User**:
   - Click **"Users"** in the left sidebar
   - Click **"Create user"**
   - **User name**: `ses-app-uploader` (or any name you prefer)
   - Click **"Next"**
3. **Set Permissions**:
   - Select **"Attach policies directly"**
   - Search for and select: **"AmazonS3FullAccess"** (or create a custom policy with only upload permissions)
   - Click **"Next"**
   - Click **"Create user"**
4. **Get Access Keys**:
   - Click on the user you just created
   - Go to **"Security credentials"** tab
   - Scroll to **"Access keys"** section
   - Click **"Create access key"**
   - Select **"Application running outside AWS"**
   - Click **"Next"**
   - Add description: "SES App File Uploads"
   - Click **"Create access key"**
   - ⚠️ **IMPORTANT**: Copy both:
     - **Access key ID** (starts with `AKIA...`)
     - **Secret access key** (long string - you can only see it once!)
   - Save these securely - you'll add them to your `.env` file

### Step 4: Configure CORS (Cross-Origin Resource Sharing)

This allows your Next.js app to upload files directly to S3.

1. **Go back to S3**: Navigate to your bucket
2. **Permissions Tab**: Click on your bucket → **"Permissions"** tab
3. **CORS Configuration**: Scroll to **"Cross-origin resource sharing (CORS)"**
4. **Edit CORS**: Click **"Edit"** and paste this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST", "GET", "DELETE", "HEAD"],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://yourdomain.com"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

**Note**: Replace `https://yourdomain.com` with your actual domain when you deploy.

5. Click **"Save changes"**

### Step 5: Add Environment Variables

Add these to your `.env` file in the `ses-app` directory:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=your_region_here
S3_BUCKET_NAME=your_bucket_name_here
```

**Example**:
```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
S3_BUCKET_NAME=ses-evidence-uploads-2024
```

### Step 6: Test Your Setup

After installing dependencies and setting up the code, you can test by:
1. Starting your dev server: `npm run dev`
2. Logging in and navigating to the upload page
3. Trying to upload a test file

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Rotate keys periodically** - Create new keys and delete old ones
3. **Use IAM policies** - Limit permissions to only what's needed
4. **Enable bucket encryption** - Already done in Step 2
5. **Monitor usage** - Check AWS billing dashboard regularly

## 💰 Cost Estimation

**AWS Free Tier** (first 12 months):
- 5 GB storage
- 20,000 GET requests
- 2,000 PUT requests

**After Free Tier** (approximate):
- Storage: ~$0.023 per GB/month
- Requests: ~$0.005 per 1,000 requests

For a school system with moderate usage, expect **$1-5/month** after free tier.

## 🆘 Troubleshooting

**Error: "Access Denied"**
- Check that your IAM user has S3 permissions
- Verify access keys are correct in `.env`

**Error: "Bucket not found"**
- Verify bucket name in `.env` matches exactly
- Check AWS region is correct

**Error: "CORS policy"**
- Make sure CORS is configured in S3 bucket
- Check that your domain is in the AllowedOrigins list

**Files not uploading**
- Check browser console for errors
- Verify network tab shows requests to S3
- Check AWS CloudWatch logs (if enabled)

## 📚 Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

---

**Need Help?** If you encounter any issues, check the error messages and AWS console for more details.



