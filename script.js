// Video Genie - Main JavaScript File
const API_BASE_URL = 'https://nyt229-3000.csb.app';
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

class VideoGenie {
    constructor() {
        this.currentUser = null;
        this.isPremium = false;
        this.isAuthenticated = false;
        this.currentVideoUrl = null;
        this.currentAudioUrl = null;
        this.conversionResult = null;
        this.selectedQuality = null;
        this.uploadedVideoFile = null;
        this.uploadedAudioFile = null;
        this.currentPlan = null; // To store selected plan during payment
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupModals();
        this.setupTabs();
        this.setupFAQ();
        this.setupPricing();
        this.setupAuthentication();
        this.checkUserStatus();
    }

    // Authentication Setup
    setupAuthentication() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Download functionality
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleVideoDownload());
        }

        const finalDownloadBtn = document.getElementById('finalDownloadBtn');
        if (finalDownloadBtn) {
            finalDownloadBtn.addEventListener('click', () => this.handleFinalDownload());
        }

        // Converter functionality
        const analyzeVideoBtn = document.getElementById('analyzeVideoBtn');
        if (analyzeVideoBtn) {
            analyzeVideoBtn.addEventListener('click', () => this.analyzeVideoForAudio());
        }

        const analyzeAudioBtn = document.getElementById('analyzeAudioBtn');
        if (analyzeAudioBtn) {
            analyzeAudioBtn.addEventListener('click', () => this.analyzeAudioForVideo());
        }

        const convertToAudioBtn = document.getElementById('convertToAudioBtn');
        if (convertToAudioBtn) {
            convertToAudioBtn.addEventListener('click', () => this.convertToAudio());
        }

        const convertToVideoBtn = document.getElementById('convertToVideoBtn');
        if (convertToVideoBtn) {
            convertToVideoBtn.addEventListener('click', () => this.convertToVideo());
        }

        // File upload handlers
        const videoFileInput = document.getElementById('videoFileInput');
        if (videoFileInput) {
            videoFileInput.addEventListener('change', (e) => this.handleVideoFileUpload(e));
        }

        const audioFileInput = document.getElementById('audioFileInput');
        if (audioFileInput) {
            audioFileInput.addEventListener('change', (e) => this.handleAudioFileUpload(e));
        }

        // Quality selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quality-btn')) {
                this.selectQuality(e.target);
            }
            if (e.target.classList.contains('format-btn')) {
                this.selectFormat(e.target);
            }
            if (e.target.classList.contains('background-option')) {
                this.selectBackground(e.target);
            }
        });

        // URL input validation
        const urlInputs = document.querySelectorAll('.url-input');
        urlInputs.forEach(input => {
            input.addEventListener('input', (e) => this.validateURL(e.target));
        });
    }

    // Navigation Setup
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // Modal Setup
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    // Tab Setup for Converter
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // FAQ Setup
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => faqItem.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Pricing Setup
    setupPricing() {
        const billingToggle = document.getElementById('billingToggle');
        const premiumBtns = document.querySelectorAll('.premium-btn, .pro-btn');

        if (billingToggle) {
            billingToggle.addEventListener('change', () => {
                this.toggleBilling(billingToggle.checked);
            });
        }

        premiumBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const plan = btn.getAttribute('data-plan');
                const isYearly = billingToggle ? billingToggle.checked : false;
                this.openPaymentModal(plan, isYearly);
            });
        });

        // Payment form
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }
    }

    // Video Download Functionality
    async handleVideoDownload() {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        const urlInput = document.getElementById('videoUrl');
        const url = urlInput ? urlInput.value.trim() : '';

        if (!this.isValidURL(url)) {
            this.showNotification('Please enter a valid video URL', 'error');
            return;
        }

        this.showLoading();
        
        try {
            // Simulate API call to analyze video
            const videoData = await this.analyzeVideo(url);
            this.displayVideoPreview(videoData);
        } catch (error) {
            if (error.message.includes('401')) {
                this.showAuthRequiredModal();
            } else {
                this.showNotification('Failed to analyze video. Please try again.', 'error');
            }
            console.error('Video analysis error:', error);
        } finally {
            this.hideLoading();
        }
    }
    showAuthRequiredModal() {
        const modal = document.getElementById('authRequiredModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('fade-in');
        }
    }

    async analyzeVideo(url, file = null) {
        let response;
        if (file) {
            const formData = new FormData();
            formData.append('videoFile', file);
            response = await fetch(`${API_BASE_URL}/api/analyze-video`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            this.currentVideoUrl = 'uploaded-file';
        } else {
            response = await fetch(`${API_BASE_URL}/api/analyze-video?url=${encodeURIComponent(url)}`, {
                credentials: 'include'
            });
            this.currentVideoUrl = url;
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to analyze video: ${response.status} ${errorText}`);
        }
        return await response.json();
    }

    displayVideoPreview(videoData) {
        const previewElement = document.getElementById('videoPreview');
        const thumbnail = document.getElementById('videoThumbnail');
        const title = document.getElementById('videoTitle');
        const duration = document.getElementById('videoDuration');
        const size = document.getElementById('videoSize');

        if (thumbnail) thumbnail.src = videoData.thumbnail;
        if (title) title.textContent = videoData.title;
        if (duration) duration.textContent = `Duration: ${videoData.duration}`;
        if (size) size.textContent = `Size: ${videoData.size}`;

        previewElement.classList.remove('hidden');
        previewElement.classList.add('fade-in');
    }

    selectQuality(button) {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        // Remove selected class from all quality buttons
        document.querySelectorAll('.quality-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selected class to clicked button
        button.classList.add('selected');

        const quality = button.getAttribute('data-quality');
        const isPremium = button.classList.contains('premium');

        if (isPremium && !this.isPremium) {
            this.showPremiumModal();
            return;
        }

        this.selectedQuality = quality;
    }

    async handleFinalDownload() {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        if (!this.selectedQuality) {
            this.showNotification('Please select a quality first', 'warning');
            return;
        }

        const quality = this.selectedQuality;
        const isPremium = ['480p', '720p', '1080p'].includes(quality);

        if (isPremium && !this.isPremium) {
            this.showPremiumModal();
            return;
        }

        this.showNotification('Starting download...', 'success');
        
        try {
            // Simulate download process
            await this.downloadVideo(quality);
            this.showNotification('Download completed successfully!', 'success');
        } catch (error) {
            if (error.message.includes('401')) {
                this.showAuthRequiredModal();
            } else if (error.message.includes('403')) {
                this.showPremiumModal();
            } else {
                this.showNotification('Download failed. Please try again.', 'error');
            }
            console.error('Download error:', error);
        }
    }

    async downloadVideo(quality) {
        const response = await fetch(`${API_BASE_URL}/api/download-video?url=${encodeURIComponent(this.currentVideoUrl)}&quality=${quality}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to download video: ${response.status} ${errorText}`);
        }
        const data = await response.json();

        // Show remaining downloads if applicable
        if (data.remainingDownloads !== 'unlimited') {
            this.showNotification(`Download started! ${data.remainingDownloads} downloads remaining today.`, 'info');
        }

        // Trigger download
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}${data.downloadUrl}`;
        link.download = data.filename;
        link.click();
    }

    // Converter Functionality
    async analyzeVideoForAudio() {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        const urlInput = document.getElementById('videoToAudioUrl');
        const url = urlInput ? urlInput.value.trim() : '';

        if (!url && !this.uploadedVideoFile) {
            this.showNotification('Please enter a URL or upload a video file', 'error');
            return;
        }

        this.showLoading();
        
        try {
            const videoData = await this.analyzeVideo(url, this.uploadedVideoFile);
            this.displayVideoToAudioPreview(videoData);
        } catch (error) {
            if (error.message.includes('401')) {
                this.showAuthRequiredModal();
            } else {
                this.showNotification('Failed to analyze video. Please try again.', 'error');
            }
        } finally {
            this.hideLoading();
        }
    }

    async analyzeAudioForVideo() {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        const urlInput = document.getElementById('audioToVideoUrl');
        const url = urlInput ? urlInput.value.trim() : '';

        if (!url && !this.uploadedAudioFile) {
            this.showNotification('Please enter a URL or upload an audio file', 'error');
            return;
        }

        this.showLoading();
        
        try {
            const audioData = await this.analyzeAudio(url, this.uploadedAudioFile);
            this.displayAudioToVideoPreview(audioData);
        } catch (error) {
            if (error.message.includes('401')) {
                this.showAuthRequiredModal();
            } else {
                this.showNotification('Failed to analyze audio. Please try again.', 'error');
            }
        } finally {
            this.hideLoading();
        }
    }

    async analyzeAudio(url, file = null) {
        let response;
        if (file) {
            const formData = new FormData();
            formData.append('audioFile', file);
            response = await fetch(`${API_BASE_URL}/api/analyze-audio`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            this.currentAudioUrl = 'uploaded-file';
        } else {
            response = await fetch(`${API_BASE_URL}/api/analyze-audio?url=${encodeURIComponent(url)}`, {
                credentials: 'include'
            });
            this.currentAudioUrl = url;
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to analyze audio: ${response.status} ${errorText}`);
        }
        return await response.json();
    }

    displayVideoToAudioPreview(videoData) {
        const previewElement = document.getElementById('videoToAudioPreview');
        const thumbnail = document.getElementById('v2aVideoThumbnail');
        const title = document.getElementById('v2aVideoTitle');
        const duration = document.getElementById('v2aVideoDuration');
        const size = document.getElementById('v2aVideoSize');

        if (thumbnail) thumbnail.src = videoData.thumbnail;
        if (title) title.textContent = videoData.title;
        if (duration) duration.textContent = `Duration: ${videoData.duration}`;
        if (size) size.textContent = `Size: ${videoData.size}`;

        previewElement.classList.remove('hidden');
        previewElement.classList.add('fade-in');
    }

    displayAudioToVideoPreview(audioData) {
        const previewElement = document.getElementById('audioToVideoPreview');
        const title = document.getElementById('a2vAudioTitle');
        const duration = document.getElementById('a2vAudioDuration');
        const size = document.getElementById('a2vAudioSize');

        if (title) title.textContent = audioData.title;
        if (duration) duration.textContent = `Duration: ${audioData.duration}`;
        if (size) size.textContent = `Size: ${audioData.size}`;

        previewElement.classList.remove('hidden');
        previewElement.classList.add('fade-in');
    }

    async convertToAudio() {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        const selectedFormat = document.querySelector('.format-btn.selected');
        const audioQuality = document.getElementById('audioQuality');

        if (!selectedFormat) {
            this.showNotification('Please select an audio format', 'warning');
            return;
        }

        const format = selectedFormat.getAttribute('data-format');
        const quality = audioQuality ? audioQuality.value : '192';

        this.showConversionProgress();
        
        try {
            await this.performConversion('audio', { format, quality });
            this.showConversionResult('audio', format);
        } catch (error) {
            if (error.message.includes('401')) {
                this.showAuthRequiredModal();
            } else {
                this.showNotification('Conversion failed. Please try again.', 'error');
            }
        }
    }

    async convertToVideo() {
        if (!this.isAuthenticated) {
            this.showAuthRequiredModal();
            return;
        }

        const selectedBackground = document.querySelector('.background-option.selected');
        const videoFormat = document.getElementById('videoFormat');
        const videoQuality = document.getElementById('videoQuality');

        if (!selectedBackground) {
            this.showNotification('Please select a background style', 'warning');
            return;
        }

        const background = selectedBackground.getAttribute('data-bg');
        const format = videoFormat ? videoFormat.value : 'mp4';
        const quality = videoQuality ? videoQuality.value : '360p';

        if (['480p', '720p', '1080p'].includes(quality) && !this.isPremium) {
            this.showPremiumModal();
            return;
        }

        this.showConversionProgress();
        
        try {
            await this.performConversion('video', { background, format, quality });
            this.showConversionResult('video', format);
        } catch (error) {
            if (error.message.includes('401')) {
                this.showAuthRequiredModal();
            } else if (error.message.includes('403')) {
                this.showPremiumModal();
            } else {
                this.showNotification('Conversion failed. Please try again.', 'error');
            }
        }
    }

    async performConversion(type, options) {
        const progressElement = document.getElementById('conversionProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        let endpoint, body, isFile = false;
        if (type === 'audio') {
            endpoint = '/api/convert/video-to-audio';
            if (this.uploadedVideoFile) {
                isFile = true;
                body = new FormData();
                body.append('videoFile', this.uploadedVideoFile);
                body.append('format', options.format);
                body.append('quality', options.quality);
            } else {
                body = {
                    url: this.currentVideoUrl,
                    format: options.format,
                    quality: options.quality
                };
            }
        } else {
            endpoint = '/api/convert/audio-to-video';
            if (this.uploadedAudioFile) {
                isFile = true;
                body = new FormData();
                body.append('audioFile', this.uploadedAudioFile);
                body.append('background', options.background);
                body.append('format', options.format);
                body.append('quality', options.quality);
            } else {
                body = {
                    url: this.currentAudioUrl,
                    background: options.background,
                    format: options.format,
                    quality: options.quality
                };
            }
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: isFile ? {} : { 'Content-Type': 'application/json' },
            body: isFile ? body : JSON.stringify(body),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Conversion failed');
        }

        // Simulate progress while waiting for response
        for (let i = 0; i <= 100; i += 10) {
            await this.delay(300);
            if (progressFill) progressFill.style.width = `${i}%`;
            if (progressText) progressText.textContent = `${i}% Complete`;
        }

        this.conversionResult = await response.json();
    }

    showConversionProgress() {
        const progressElement = document.getElementById('conversionProgress');
        const resultElement = document.getElementById('conversionResult');
        
        if (progressElement) {
            progressElement.classList.remove('hidden');
            progressElement.classList.add('fade-in');
        }
        if (resultElement) {
            resultElement.classList.add('hidden');
        }
    }

    showConversionResult(type, format) {
        const progressElement = document.getElementById('conversionProgress');
        const resultElement = document.getElementById('conversionResult');
        
        if (progressElement) progressElement.classList.add('hidden');
        if (resultElement) {
            resultElement.classList.remove('hidden');
            resultElement.classList.add('fade-in');
        }

        // Setup download button
        const downloadBtn = document.getElementById('downloadResultBtn');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                this.downloadConvertedFile(type, format);
            };
        }

        // Setup convert another button
        const convertAnotherBtn = document.getElementById('convertAnotherBtn');
        if (convertAnotherBtn) {
            convertAnotherBtn.onclick = () => {
                this.resetConverter();
            };
        }
    }

    downloadConvertedFile(type, format) {
        if (!this.conversionResult) {
            this.showNotification('No conversion result available', 'error');
            return;
        }

        this.showNotification(`Downloading ${type} file...`, 'success');

        // Trigger download
        const link = document.createElement('a');
        link.href = `https://nyt229-3000.csb.app${this.conversionResult.downloadUrl}`;
        link.download = this.conversionResult.filename;
        link.click();
    }

    resetConverter() {
        const previewElements = document.querySelectorAll('.conversion-preview');
        const progressElement = document.getElementById('conversionProgress');
        const resultElement = document.getElementById('conversionResult');

        previewElements.forEach(el => el.classList.add('hidden'));
        if (progressElement) progressElement.classList.add('hidden');
        if (resultElement) resultElement.classList.add('hidden');

        // Reset form inputs
        document.querySelectorAll('.url-input').forEach(input => input.value = '');
        document.querySelectorAll('.format-btn.selected').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.background-option.selected').forEach(opt => opt.classList.remove('selected'));
    }

    // File Upload Handlers
    handleVideoFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.uploadedVideoFile = file;
            this.showNotification(`Video file "${file.name}" uploaded successfully`, 'success');
            
            // Auto-analyze uploaded file
            setTimeout(() => {
                this.analyzeVideoForAudio();
            }, 500);
        }
    }

    handleAudioFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.uploadedAudioFile = file;
            this.showNotification(`Audio file "${file.name}" uploaded successfully`, 'success');
            
            // Auto-analyze uploaded file
            setTimeout(() => {
                this.analyzeAudioForVideo();
            }, 500);
        }
    }

    // Format and Background Selection
    selectFormat(button) {
        const container = button.closest('.format-options') || button.closest('.format-grid').parentElement;
        container.querySelectorAll('.format-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
    }

    selectBackground(option) {
        document.querySelectorAll('.background-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
    }

    // Pricing and Payment
    toggleBilling(isYearly) {
        const monthlyElements = document.querySelectorAll('.monthly-price, .monthly-period, .monthly-text');
        const yearlyElements = document.querySelectorAll('.yearly-price, .yearly-period, .yearly-text, .yearly-savings');

        if (isYearly) {
            monthlyElements.forEach(el => el.classList.add('hidden'));
            yearlyElements.forEach(el => el.classList.remove('hidden'));
        } else {
            monthlyElements.forEach(el => el.classList.remove('hidden'));
            yearlyElements.forEach(el => el.classList.add('hidden'));
        }
    }

    openPaymentModal(plan, isYearly) {
        const modal = document.getElementById('paymentModal');
        const planName = document.getElementById('selectedPlanName');
        const planPrice = document.getElementById('selectedPlanPrice');
        const summaryPlan = document.getElementById('summaryPlan');
        const summaryBilling = document.getElementById('summaryBilling');
        const summaryTotal = document.getElementById('summaryTotal');

        const prices = {
            premium: { monthly: 3600, yearly: 34800 },
            pro: { monthly: 5000, yearly: 48000 }
        };

        const price = isYearly ? prices[plan].yearly : prices[plan].monthly;
        const period = isYearly ? 'year' : 'month';

        if (planName) planName.textContent = `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`;
        if (planPrice) planPrice.textContent = `₦${price.toLocaleString()}/${period}`;
        if (summaryPlan) summaryPlan.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
        if (summaryBilling) summaryBilling.textContent = isYearly ? 'Yearly' : 'Monthly';
        if (summaryTotal) summaryTotal.textContent = `₦${price.toLocaleString()}`;

        this.currentPlan = { plan, isYearly, price };
        this.openModal(modal);
    }

    async processPayment() {
        const email = document.getElementById('customerEmail')?.value?.trim();
         if (!email ) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Initialize Paystack payment
        const handler = PaystackPop.setup({
            key: 'pk_live_1b299f608de3128820fa79b9d205fb1654f193da',//PAYSTACK_PUBLIC_KEY, // runtime-injected public key (window.__VIDEO_GENIE__.PAYSTACK_PUBLIC_KEY) or fallback
            email,
            amount: this.currentPlan.price * 100, // Amount in kobo
            currency: 'NGN',
            ref: 'VG_' + Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Plan",
                        variable_name: "plan",
                        value: this.currentPlan.plan
                    },
                    {
                        display_name: "Billing",
                        variable_name: "billing",
                        value: this.currentPlan.isYearly ? 'yearly' : 'monthly'
                    }
                ]
            },
            callback: (response) => {
                this.handlePaymentSuccess(response);
            },
            onClose: () => {
                this.showNotification('Payment window closed', 'warning');
            }
        });

        handler.openIframe();
        this.showNotification('Redirecting to payment gateway...', 'info');

    }

    async handlePaymentSuccess(response) {
        try {
            // Update subscription on server
            const updateResponse = await fetch(`${API_BASE_URL}/api/user/subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    plan: this.currentPlan.plan,
                    billingCycle: this.currentPlan.isYearly ? 'yearly' : 'monthly',
                    paymentReference: response.reference
                })
            });

            if (updateResponse.ok) {
                const data = await updateResponse.json();
                
                // Update local user state
                this.isPremium = true;
                if (this.currentUser) {
                    this.currentUser.isPremium = true;
                    this.currentUser.subscriptionPlan = this.currentPlan.plan;
                }

                this.closeModal(document.getElementById('paymentModal'));
                this.showNotification('Payment successful! Welcome to Video Genie Premium!', 'success');
                this.updateAuthUI();
                
                // Redirect to main page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error('Failed to update subscription');
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showNotification('Payment successful but failed to update account. Please contact support.', 'warning');
        }
    }

    // Authentication Methods
    async handleLogin() {
        window.location.href = `${API_BASE_URL}/auth/google`;
    }

    async handleLogout() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                this.currentUser = null;
                this.isPremium = false;
                this.isAuthenticated = false;
                this.updateAuthUI();
                this.showNotification('Logged out successfully', 'success');
                
                // Redirect to home page
                window.location.href = '/';
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Logout failed. Please try again.', 'error');
        }
    }

    // User Status Management
    async checkUserStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/status`, {
                    method: 'GET',
                    credentials: 'include', // important for cookies/sessions
                    headers: { 'Content-Type': 'application/json' }
                });

            if (response.ok) {
                const data = await response.json();
                
                if (data.isAuthenticated) {
                    this.isAuthenticated = true;
                    this.currentUser = data.user;
                    this.isPremium = data.user.isPremium;
                } else {
                    this.isAuthenticated = false;
                    this.currentUser = null;
                    this.isPremium = false;
                }
            }
        } catch (error) {
            console.error('Error checking user status:', error);
            this.isAuthenticated = false;
            this.currentUser = null;
            this.isPremium = false;
        }

        this.updateAuthUI();
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const userPlan = document.getElementById('userPlan');
        const upgradeLink = document.getElementById('upgradeLink');

        if (this.isAuthenticated && this.currentUser) {
            // Show user profile, hide login button
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            
            // Update user info
            if (userName) userName.textContent = this.currentUser.name;
            if (userAvatar) {
                userAvatar.src = this.currentUser.picture || '/logo-placeholder.png';
                userAvatar.alt = this.currentUser.name;
            }
            if (userPlan) {
                userPlan.textContent = this.currentUser.subscriptionPlan;
                userPlan.className = `user-plan ${this.currentUser.subscriptionPlan}`;
            }
            
            // Show/hide upgrade link based on subscription
            if (upgradeLink) {
                upgradeLink.style.display = this.currentUser.isPremium ? 'none' : 'block';
            }
        } else {
            // Show login button, hide user profile
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.add('hidden');
        }
    }

    showAuthRequiredModal() {
        // Create and show authentication required modal
        const modal = document.createElement('div');
        modal.className = 'auth-required-modal';
        modal.innerHTML = `
            <div class="auth-required-content">
                <h3>Sign In Required</h3>
                <p>Please sign in with your Google account to access this feature.</p>
                <div class="auth-actions">
                    <button class="login-btn" onclick="window.videoGenie.handleLogin()">
                        <i class="fab fa-google"></i>
                        Sign in with Google
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.auth-required-modal').remove()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Modal Management
    openModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    showPremiumModal() {
        const modal = document.getElementById('premiumModal');
        this.openModal(modal);
    }

    closePremiumModal() {
        const modal = document.getElementById('premiumModal');
        this.closeModal(modal);
    }

    // Loading States
    showLoading() {
        const loadingElement = document.getElementById('loadingState');
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
            loadingElement.classList.add('fade-in');
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('loadingState');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    // Utility Functions
    isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    validateURL(input) {
        const url = input.value.trim();
        if (url && !this.isValidURL(url)) {
            input.style.borderColor = 'var(--error-color)';
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--light-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 15px 20px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add type-specific styling
        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--success-color)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            notification.style.borderLeftColor = 'var(--error-color)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'warning') {
            notification.style.borderLeftColor = 'var(--warning-color)';
            notification.style.borderLeftWidth = '4px';
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Global functions for modal management
function closePremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-success .notification-content i {
        color: var(--success-color);
    }
    
    .notification-error .notification-content i {
        color: var(--error-color);
    }
    
    .notification-warning .notification-content i {
        color: var(--warning-color);
    }
    
    .notification-info .notification-content i {
        color: var(--primary-color);
    }
`;
document.head.appendChild(notificationStyles);

// Initialize Video Genie when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.videoGenie = new VideoGenie();
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
