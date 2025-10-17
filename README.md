# Video Genie 🎬

A powerful web application for downloading videos from multiple platforms and converting between video and audio formats. Built with Node.js, Express, MongoDB, and integrated with Google OAuth and Paystack for payments.

## 🚀 Features

### Core Features
- **Multi-Platform Video Downloads**: Support for YouTube, Facebook, Instagram, TikTok, Twitter, and more
- **Video to Audio Conversion**: Convert videos to various audio formats (MP3, WAV, AAC)
- **Audio to Video Conversion**: Convert audio files to video with customizable backgrounds
- **Multiple Quality Options**: Download videos in different resolutions (144p to 4K)
- **File Upload Support**: Upload and process local video/audio files

### User Management
- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **User Profiles**: Track download history and conversion statistics
- **Subscription Management**: Free and premium tier support
- **Usage Limits**: Download and conversion limits for free users

### Premium Features
- **HD/4K Downloads**: High-quality video downloads (720p, 1080p, 4K)
- **Unlimited Access**: No daily limits on downloads and conversions
- **Ad-Free Experience**: Clean interface without advertisements
- **Priority Support**: Faster customer service response
- **Batch Processing**: Download multiple videos simultaneously

### Payment Integration
- **Paystack Integration**: Secure payment processing for Nigerian users
- **Multiple Payment Methods**: Cards, bank transfers, mobile money
- **Webhook Support**: Real-time payment verification and subscription updates
- **Flexible Billing**: Monthly and yearly subscription options

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - User authentication
- **Paystack API** - Payment processing
- **Multer** - File upload handling

### Frontend
- **HTML5/CSS3** - Modern web standards
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icon library
- **Google Fonts** - Typography
- **Responsive Design** - Mobile-first approach

### Security & Infrastructure
- **HTTPS** - Secure data transmission
- **Session Management** - Secure user sessions
- **CORS** - Cross-origin resource sharing
- **Environment Variables** - Secure configuration
- **Webhook Verification** - Payment security

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Google OAuth Credentials**
- **Paystack Account** (for payments)
- **Git** (for version control)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/video-genie.git
cd video-genie
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if any)
cd ../frontend
# Frontend uses vanilla HTML/CSS/JS, no dependencies needed
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Session Configuration
SESSION_SECRET=your_super_secret_session_key_here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/video-genie

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:3000

# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here

# Contact Information
CONTACT_EMAIL=support@videogenie.com
CONTACT_PHONE=+234-814-712-5233
COMPANY_ADDRESS=Lagos, Nigeria
```

### 4. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

### 5. Paystack Setup
1. Create account at [Paystack](https://paystack.com/)
2. Get your public and secret keys from the dashboard
3. Set up webhook URL: `https://yourdomain.com/api/paystack/webhook`
4. Configure webhook events:
   - `charge.success`
   - `subscription.create`
   - `subscription.disable`
   - `invoice.create`
   - `invoice.payment_failed`

### 6. Database Setup
Make sure MongoDB is running:
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using MongoDB Compass/Atlas for cloud database
```

### 7. Start the Application
```bash
# From the backend directory
cd backend

# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
video-genie/
├── frontend/               # Frontend application
│   ├── index.html          # Main landing page
│   ├── converter.html      # Video/Audio converter page
│   ├── pricing.html        # Premium plans page
│   ├── privacy.html        # Privacy policy
│   ├── terms.html          # Terms of service
│   ├── styles.css          # Main stylesheet
│   ├── script.js           # Frontend JavaScript
│   ├── logo-placeholder.png # Logo image
│   └── favicon.ico         # Website favicon
├── backend/                # Backend API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── config/
│   │   └── passport.js     # Passport configuration
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   └── models/
│       └── User.js         # User model schema
├── uploads/                # Temporary file storage
├── .env                    # Environment variables
├── .htaccess              # Apache configuration
├── DEPLOYMENT.md          # Deployment instructions
├── GOOGLE_OAUTH_SETUP.md  # OAuth setup guide
└── README.md              # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - User logout

### User Management
- `GET /api/user/status` - Get user authentication status
- `GET /api/user/profile` - Get user profile (authenticated)
- `POST /api/user/subscription` - Update user subscription

### Video Operations
- `GET /api/analyze-video` - Analyze video from URL
- `POST /api/analyze-video` - Analyze uploaded video file
- `GET /api/download-video` - Download video in specified quality

### Audio Operations
- `GET /api/analyze-audio` - Analyze audio from URL
- `POST /api/analyze-audio` - Analyze uploaded audio file

### Conversion
- `POST /api/convert/video-to-audio` - Convert video to audio
- `POST /api/convert/audio-to-video` - Convert audio to video

### Payment
- `POST /api/paystack/webhook` - Paystack webhook handler
- `POST /api/paystack/verify` - Verify payment transaction

### Utility
- `GET /api/health` - Health check endpoint

## 💳 Payment Plans

### Free Plan
- Download up to 480p quality
- 5 downloads per day
- Basic audio conversion
- Standard support

### Premium Plan (₦3,600/month or ₦34,800/year)
- Download up to 1080p quality
- Unlimited downloads
- Advanced conversions
- Priority support
- Ad-free experience
- Batch downloads

### Pro Plan (₦5,000/month or ₦48,000/year)
- Everything in Premium
- 4K downloads (when available)
- API access
- White-label option
- Custom branding
- Dedicated support

## 🚀 Deployment

### Prerequisites for Production
- **VPS/Cloud Server** (Ubuntu 20.04+ recommended)
- **Domain Name** with SSL certificate
- **MongoDB Atlas** or self-hosted MongoDB
- **Process Manager** (PM2 recommended)
- **Reverse Proxy** (Nginx recommended)

### Deployment Steps

1. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Application Deployment**
```bash
# Clone repository
git clone https://github.com/yourusername/video-genie.git
cd video-genie

# Install backend dependencies
cd backend
npm install --production

# Set up environment variables (in project root)
cd ..
cp .env.example .env
# Edit .env with production values

# Start with PM2 from backend directory
cd backend
pm2 start server.js --name "video-genie"
pm2 startup
pm2 save
```

3. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files
- **HTTPS Only**: Use SSL certificates in production
- **Session Security**: Secure session configuration
- **Input Validation**: Validate all user inputs
- **Rate Limiting**: Implement API rate limiting
- **CORS Configuration**: Proper CORS setup
- **Webhook Verification**: Verify Paystack webhooks

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service status
   - Verify connection string in `.env`
   - Ensure MongoDB is accessible

2. **Google OAuth Error**
   - Verify OAuth credentials
   - Check redirect URIs
   - Ensure Google+ API is enabled

3. **Paystack Webhook Issues**
   - Verify webhook URL is accessible
   - Check webhook signature verification
   - Ensure HTTPS for production webhooks

4. **File Upload Issues**
   - Check `uploads/` directory permissions
   - Verify disk space availability
   - Review file size limits

## 📞 Support & Contact

- **Email**: [support@videogenie.com](mailto:support@videogenie.com)
- **Phone**: [+234-814-712-5233](tel:+2348147125233)
- **Address**: Lagos, Nigeria

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Paystack** for payment processing
- **Google** for OAuth authentication
- **MongoDB** for database services
- **Font Awesome** for icons
- **All contributors** who helped build this project

---

**Video Genie** - Making video downloads and conversions simple and accessible for everyone! 🎬✨
