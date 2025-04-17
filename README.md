# MoodsCare - Emotional Wellness Application

## Overview
MoodsCare is a comprehensive emotional wellness application that combines mood tracking, real-time emotion detection, and AI-powered emotional support. The project consists of two main components:
1. A mobile application (React Native)
2. A web-based emotion detection system (React)

## Demo Video
https://portland-my.sharepoint.com/personal/yuywang9-c_my_cityu_edu_hk/_layouts/15/stream.aspx?id=%2Fpersonal%2Fyuywang9-c%5Fmy%5Fcityu%5Fedu%5Fhk%2FDocuments%2FAttachments%2FFinal%5FYear%5FProject%5FDemo%5FVideo%2Emp4&ct=1744891740892&or=OWA%2DNT%2DMail&cid=4ce8cb41%2D0caa%2D0a11%2De2b3%2D9ef485bd1a83&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Eb6aae37a%2D05c9%2D45e6%2Da057%2Dfa819990176a

## Features

### Mobile Application
- *Mood Logging System*
  - Intuitive 5-level mood selection with emoji representations
  - Detailed emotion categorization with color coding
  - Customizable factors affecting mood (work, family, school, etc.)
  - Personal diary entries
  - Summary view with emotion analysis
 
    
    <img width="839" alt="Screenshot 2025-04-17 195458" src="https://github.com/user-attachments/assets/5a3d6ca7-6e65-432d-a483-c91e19fd666b" />


- *Visualization Dashboard*
  - Interactive mood trend charts
  - Emotion distribution pie charts
  - Factor analysis showing positive and negative influences
  - Time-based mood patterns
 
    <img width="410" alt="Screenshot 2025-04-17 195649" src="https://github.com/user-attachments/assets/00826f28-47e2-4929-9cee-c9bc2c7c6c00" />


- *AI-Powered Chat Support*
  - Context-aware conversations using DeepSeek API
  - Emotional guidance based on recent mood entries
  - Real-time chat interface
  - Focus on emotional well-being

    <img width="190" alt="Screenshot 2025-04-17 195803" src="https://github.com/user-attachments/assets/f86f6c8e-54e8-4470-b0d0-5c81bd4b41ee" />


- *Records Management*
  - Comprehensive history of mood entries
  - Detailed view of past emotions and factors
  - Timestamp-based organization

    <img width="190" alt="Screenshot 2025-04-17 195953" src="https://github.com/user-attachments/assets/7701513b-ed5b-40da-935b-644abb60012b" />


### Web Application
- *Real-time Emotion Detection*
  - Webcam-based facial expression analysis
  - TensorFlow.js and face-api.js integration
  - Automated alerts sent to mobile app for persistent negative emotions
  - Firebase integration for cross-platform communication
 
    
  <img width="620" alt="Screenshot 2025-04-17 200145" src="https://github.com/user-attachments/assets/74f6c419-157a-4aa1-94c9-af2b3fc5c68b" />

## Tech Stack

### Mobile Application
- *Frontend Framework*: React Native with Expo
- *State Management*: React Hooks
- *Navigation*: React Navigation (Stack & Tab)
- *UI Components*: 
  - react-native-vector-icons
  - react-native-chart-kit
  - react-native-gifted-chat
- *Backend Integration*: Firebase Firestore

### Web Application
- *Frontend Framework*: React.js
- *Machine Learning*: TensorFlow.js, face-api.js
- *Backend Integration*: Firebase Firestore
- *Development Environment*: Create React App

## Installation

### Mobile Application
1. Clone the repository
- git clone [https://github.com/yuywang9/MoodsCare.git]
- cd MoodsCareApp


2. Install dependencies
- npm install


3. Set up Firebase
- Create a Firebase project
- Add your Firebase configuration in firebaseConfig.js
- Enable Firestore in your Firebase console

4. Set up DeepSeek API
- Obtain API key from DeepSeek
- Add your API key in ChatGPT.jsx

5. Start the application
- expo start


### Web Application (Emotion Detection)
1. Navigate to web application directory
- cd "Web Application/emotion-detection"


2. Install dependencies
- npm install


3. Start the development server
- npm start

### User Diary Emotion Analysis Model Training
1. Navigate to Diary_Emotion_Analysis_Model directory
2. Train the model using User_Diary_Emotion_Analysis_Model.py script with Emotion_Dataset.xls dataset
3. Deploy the model online

## Environment Setup Requirements
- Node.js v12 or higher
- Expo CLI
- Firebase account
- DeepSeek API key
- Webcam (for web application)
- Android Studio (for Android development)
- Xcode (for iOS development)

## Project Structure


## Contributing
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Security Note
Please ensure to properly secure your API keys and Firebase configuration in production environments.

## Authors
[Wang Yuyang]

## Acknowledgments
- Face-api.js and TensorFlow.js for facial emotion detection
- DeepSeek for AI capabilities
- Firebase for backend services
- React Native community
