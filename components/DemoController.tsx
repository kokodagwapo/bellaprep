import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { generateBellaSpeech } from '../services/geminiService';
import { decodeAudioData, decode } from '../utils/audioUtils';

interface DemoScriptStep {
  time: number;
  action: string;
  text: string;
  targetUrl?: string;
  scrollTarget?: string;
  clickTarget?: string;
  navigateTo?: 'home' | 'prep' | 'form1003' | 'documents';
  fillData?: Record<string, any>;
  waitForElement?: string;
}

// Script variations for each demo step (11 variations per step)
const demoScriptVariations: { [key: number]: DemoScriptStep[] } = {
  // Step 0: Landing Page - Storytelling & Heartfelt Introductions
  0: [
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "You know, I've been thinking about this moment a lot. There's something really special about helping someone take that first step toward their dream home. I'm Bella, and I'm genuinely excited to be part of your journey. Whether you're buying your first place together, upgrading for a growing family, or finally getting that home you've been saving for—this is a big deal, and I'm here to make sure it feels amazing, not overwhelming.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hi there. I'm Bella, and I have to tell you—I get really excited when I meet people who are ready to buy a home. It's such a meaningful step in your life, you know? Whether you're a young couple starting out, planning for kids, or just ready for that next chapter, I want you to know that I'm genuinely here to help. This process doesn't have to be stressful. Let's make it something you actually look back on fondly.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and honestly? I'm so happy you're here. Buying a home is one of those life moments that should feel exciting and hopeful, not scary and complicated. I've seen so many couples go through this journey, and I know how much it means to you. That's why I'm here—to make sure you feel supported, understood, and confident every step of the way. Let's do this together.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hey, I'm Bella. Can I be real with you for a second? I love what I do because I get to be part of something really meaningful. When you're buying a home, you're not just getting a house—you're creating a space for your life, your memories, your future. That matters to me. I'm here to guide you through this with care, understanding, and a genuine desire to see you succeed. Ready to start?",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and I want you to know something: I'm genuinely excited to be part of your home buying journey. I know this can feel overwhelming—there's so much to think about, so many decisions to make. But here's the thing: you don't have to figure it all out alone. I'm here to walk alongside you, answer your questions, and make sure you feel confident and supported. Let's make this process something you'll actually enjoy.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hi there! I'm Bella, and I'm honestly thrilled you're here. You know, buying a home is such a personal journey. Whether you're planning your first home together, making room for a growing family, or just ready for that next step—this is your moment, and I want to make sure it feels right. I'm here to listen, to understand your situation, and to guide you through this with empathy and care. Let's start this journey together.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and I have to say—I'm genuinely excited to help you with this. Buying a home is one of those big life moments, you know? It's about more than just a mortgage or paperwork. It's about creating a space where your life happens, where memories are made. I want you to feel supported and understood throughout this process. Let's make this journey something you'll look back on with a smile.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hey, I'm Bella. Can I share something with you? Every time I help someone start their home buying journey, I get this feeling—like I'm witnessing something really special. This is your moment. Whether you're buying your first place together, upgrading for your family, or just ready for that next chapter, I want you to know I'm here with genuine care and excitement. Let's make this process feel as meaningful as it actually is.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hi! I'm Bella, and I'm so glad you're here. You know what? I love helping people through this journey because I know how much it means to you. Buying a home isn't just a transaction—it's about creating a foundation for your life together. Whether you're planning for your first home, making space for kids, or just ready for that next step, I'm genuinely excited to be part of this with you. Let's make it amazing.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and honestly, I'm thrilled you're taking this step. I know this can feel like a lot—there's so much to consider, so many decisions. But here's what I want you to know: you're not alone in this. I'm here to guide you with understanding, patience, and genuine care. Whether you're buying your first home together or upgrading for your family, this is your journey, and I'm excited to be part of it.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hi there! I'm Bella, and I want you to know how genuinely excited I am to help you with this. Buying a home is such a meaningful milestone—it's about creating a space for your life, your dreams, your future together. I know this process can feel overwhelming, but I'm here to make sure you feel supported, understood, and confident. Let's take this journey together, one step at a time.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hey! I'm Bella, and I'm honestly so happy you're here. You know, I've helped so many couples through this journey, and every time, I'm reminded of how special this moment is. Whether you're buying your first home together, planning for a growing family, or just ready for that next chapter—this is a big deal, and I want to make sure it feels amazing. I'm here with genuine care and excitement. Let's do this!",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and I have to tell you—I get really excited when I meet people ready to buy a home. This is such a meaningful step in your life together. Whether you're planning your first place, making room for kids, or just ready for that next adventure, I want you to know I'm genuinely here for you. This process doesn't have to be stressful. Let's make it something you'll actually remember fondly.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hi! I'm Bella, and I'm so genuinely excited to be part of your home buying journey. You know what? I love what I do because I get to witness these beautiful moments in people's lives. Buying a home is about more than just a mortgage—it's about creating a space where your life happens, where memories are made. I'm here to guide you with care, understanding, and real excitement. Let's start this journey together.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hey there! I'm Bella, and honestly? I'm thrilled you're here. Buying a home is one of those life moments that should feel exciting and hopeful, not scary and complicated. I've seen so many couples go through this, and I know how much it means to you. That's why I'm here—to make sure you feel supported, understood, and confident every step of the way. This is your moment, and I'm genuinely excited to be part of it.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and I want you to know something: I'm genuinely excited to help you with this. You know, buying a home is such a personal journey. Whether you're planning your first home together, making space for a growing family, or just ready for that next step—this is your moment, and I want to make sure it feels right. I'm here to listen, to understand, and to guide you with empathy and care. Let's make this amazing.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hi! I'm Bella, and I'm so glad you're here. Can I be real with you? I love helping people through this journey because I know how much it means. Buying a home isn't just about paperwork or numbers—it's about creating a foundation for your life together. Whether you're buying your first place, planning for kids, or just ready for that next chapter, I'm genuinely excited to be part of this with you. Let's do this!",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hey, I'm Bella. You know what? Every time I help someone start their home buying journey, I get this feeling—like I'm witnessing something really special. This is your moment. Whether you're buying your first home together, upgrading for your family, or just ready for that next adventure, I want you to know I'm here with genuine care and excitement. Let's make this process feel as meaningful as it actually is.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
    {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Welcome! I'm Bella, and I'm honestly so happy you're taking this step. I know this can feel like a lot—there's so much to consider, so many decisions. But here's what I want you to know: you're not alone. I'm here to guide you with understanding, patience, and genuine care. Whether you're planning your first home or upgrading for your family, this is your journey, and I'm excited to be part of it.",
      navigateTo: 'home',
      scrollTarget: "top"
    },
  {
    time: 0,
    action: "Landing Page & Scroll",
      text: "Hi there! I'm Bella, and I want you to know how genuinely excited I am to help you with this. Buying a home is such a meaningful milestone—it's about creating a space for your life, your dreams, your future together. I know this process can feel overwhelming, but I'm here to make sure you feel supported, understood, and confident. Let's take this journey together, one step at a time, with care and excitement.",
      navigateTo: 'home',
    scrollTarget: "top"
  },
  {
      time: 0,
      action: "Landing Page & Scroll",
      text: "Hey! I'm Bella, and I'm genuinely thrilled you're here. You know, I've helped so many couples through this journey, and every time, I'm reminded of how special this moment is. Whether you're buying your first home together, planning for a growing family, or just ready for that next chapter—this is a big deal, and I want to make sure it feels amazing. I'm here with genuine care and excitement. Let's make this something you'll remember fondly!",
      navigateTo: 'home',
      scrollTarget: "top"
    }
  ],
  // Step 1: Navigate to Prep4Loan
  1: [
    {
      time: 8,
      action: "Navigate to Prep4Loan",
    text: "We start here. No scary forms yet. Just you, me, and some big friendly buttons. It's like a dating app, but for your dream home.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Alright, let's dive in! Click that 'Start Pre-Evaluation' button and we'll begin. Don't worry—I'll be with you every step of the way. This is going to be painless, I promise!",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Ready to get started? Just hit that big button right there. We're going to ask you some simple questions—nothing overwhelming, I swear. Think of it as a friendly conversation about your goals.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Here we go! Time to start your pre-evaluation. Click the button and let's see what you're working with. I'll make sure this is quick, easy, and actually helpful.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Let's begin! That button right there is your ticket to a smoother mortgage process. Click it and we'll start gathering the basics. No pressure, just progress!",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Okay, here's where the magic happens. Click 'Start Pre-Evaluation' and we'll walk through this together. I'll explain everything as we go, so you're never left wondering what's happening.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Time to take the first step! That button is your starting point. Click it and we'll begin the pre-evaluation process. I've got your back through all of this!",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Alright, let's do this! Click that button and we'll get your pre-evaluation rolling. I'll guide you through each question, so you'll know exactly what we need and why.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Here we go! Click 'Start Pre-Evaluation' and let's begin. I promise this won't be like those other mortgage sites that make you feel lost. We're keeping this simple and clear.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Ready? Let's start your journey! Click that button and we'll begin the pre-evaluation. I'll be right here, making sure everything makes sense and you're comfortable with each step.",
      navigateTo: 'prep'
    },
    {
      time: 8,
      action: "Navigate to Prep4Loan",
      text: "Perfect! Click 'Start Pre-Evaluation' and we're off. This is going to be way easier than you think. I'll walk you through everything, so just relax and follow along!",
      navigateTo: 'prep'
    }
  ],
  // Step 2: Welcome Screen
  2: [
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "See how easy this is? I'm just asking the basics. We keep it light because, let's be honest, nobody wakes up excited to fill out paperwork. Click 'Get Started' when you're ready."
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Welcome to the Prep4Loan flow! I'm going to ask you some straightforward questions. Nothing complicated—just the essentials we need to help you get pre-qualified. Ready? Click 'Get Started'!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Alright, here's the deal: I'm going to guide you through a few simple questions. We'll take it step by step, and I'll explain everything along the way. When you're ready, hit 'Get Started'!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "This is where we start gathering the basics. Don't worry—I'm not going to overwhelm you with a million questions. Just the important stuff, one step at a time. Click 'Get Started' to begin!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Hey! So we're going to go through this together. I'll ask you some questions, you'll answer them, and before you know it, you'll be pre-qualified. Simple as that! Ready? Click 'Get Started'!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Welcome! I'm here to make this process as smooth as possible. We'll go through each question together, and I'll make sure you understand everything. When you're ready, click 'Get Started'!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Perfect! Let's get this started. I'm going to ask you some questions about your situation, and we'll work through them together. Nothing stressful—just clear, simple questions. Click 'Get Started' when ready!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Alright, here we go! I'll walk you through each step of the pre-evaluation. We'll keep it simple and straightforward. No tricks, no confusion—just helpful guidance. Click 'Get Started' to begin!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Great! Now we're getting into the good stuff. I'll ask you some questions, and you'll answer them at your own pace. Take your time—there's no rush. Click 'Get Started' when you're ready!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Welcome to the flow! I'm going to help you through this step by step. Each question is important, but I'll make sure you understand why we're asking. Ready? Click 'Get Started'!"
    },
    {
      time: 16,
      action: "Step-by-Step Flow - Welcome Screen",
      text: "Perfect! Let's dive in. I'll guide you through each question, explaining what we need and why. This is going to be way easier than you think. Click 'Get Started' to begin the journey!"
    }
  ],
  // Step 3: Progress Bar & Checklist
  3: [
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Check out the left side. That's Bella—that's me!—keeping you organized. I'm like your personal assistant, but I don't drink all your coffee. I build your checklist in real-time so you know exactly what's happening.",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "See that checklist on the left? That's me tracking your progress in real-time. As you fill things out, I update it automatically. It's like having a personal assistant who never forgets anything!",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Look over there on the left—that's your progress tracker! I'm keeping tabs on everything you've completed and what's still needed. It updates as you go, so you always know where you stand.",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Notice the checklist on the left? That's me working behind the scenes to keep you organized. Every time you complete something, I check it off. It's like having a built-in progress tracker!",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Check out your progress tracker on the left! I'm updating it in real-time as you move through the form. You'll always know what's done and what's next. Pretty cool, right?",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "See that sidebar? That's your personal checklist that I'm managing for you. As you answer questions, I automatically update it. No manual tracking needed—I've got you covered!",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Look at the left side—that's your progress dashboard! I'm tracking everything you complete and showing you what's still needed. It updates instantly, so you're never left wondering what's next.",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Check out the checklist on the left! That's me keeping you organized throughout this process. Every step you complete gets checked off automatically. It's like having a co-pilot for your mortgage journey!",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "See that progress tracker? I'm building it in real-time as you go through the form. You'll always know exactly what you've done and what's coming up next. No surprises, just clear progress!",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
    action: "Progress Bar & Checklist",
      text: "Notice the sidebar checklist? That's me working behind the scenes to keep everything organized. I update it automatically as you complete each section. You're never flying blind with me around!",
      scrollTarget: "sidebar"
    },
    {
      time: 24,
      action: "Progress Bar & Checklist",
      text: "Look over there—that's your real-time progress tracker! I'm updating it as you move through the form, so you always know what's done and what's still needed. It's like having a built-in organizer!",
      scrollTarget: "sidebar"
    }
  ],
  // Step 4: Document List
  4: [
    {
      time: 32,
    action: "Click 'Document List'",
    text: "And for the documents? I've got super-vision. You upload your W2s, pay stubs, whatever—and I use OCR to read them instantly. I verify them faster than you can say 'low interest rate'.",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Now let's talk documents! When you upload your files, I use advanced OCR technology to read and verify them automatically. W2s, pay stubs, bank statements—I can handle them all in seconds!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Here's where the magic happens with documents. Upload your files and I'll read them using OCR—that's optical character recognition. I extract all the important info automatically. No manual typing needed!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Documents? I've got you covered! Upload your W2s, pay stubs, or bank statements, and I'll read them instantly using OCR technology. I pull out all the key information automatically. It's like having a super-powered assistant!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Let's check out the document section! When you upload files, I use OCR to read them automatically. I can extract information from W2s, pay stubs, and more—all in real-time. Pretty impressive, right?",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Documents are my specialty! Upload your files and I'll use OCR technology to read and verify them instantly. I can handle W2s, pay stubs, bank statements—you name it. All automated, all accurate!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Time to see the document management system! I use OCR—optical character recognition—to read your uploaded files automatically. W2s, pay stubs, whatever you've got—I'll extract the info in seconds!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Check out the document section! When you upload files, I read them using advanced OCR technology. I can pull information from W2s, pay stubs, bank statements—all automatically. No manual data entry required!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Here's where document magic happens! Upload your files and I'll use OCR to read them instantly. I extract all the important details from W2s, pay stubs, and more. It's fast, accurate, and totally automated!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Let's look at documents! I use OCR technology to read your uploaded files automatically. W2s, pay stubs, bank statements—I can handle them all and extract the key information in real-time. Super efficient!",
      navigateTo: 'documents'
    },
    {
      time: 32,
      action: "Click 'Document List'",
      text: "Documents? I've got superpowers here! Upload your files and I'll use OCR to read them instantly. I can extract information from W2s, pay stubs, and bank statements automatically. It's like having a document-reading robot!",
      navigateTo: 'documents'
    }
  ],
  // Step 5: Home Journey (URLA 1003)
  5: [
    {
      time: 40,
    action: "Click 'Home Journey' (URLA 1003)",
    text: "Now, for the magic trick. We switch to the Home Journey. This is the serious, official 1003 form that lenders need.",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Alright, here's where it gets official! The Home Journey is the URLA 1003 form—the standard form that all lenders use. But don't worry, I'll make this easy for you!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Time for the Home Journey! This is the official URLA 1003 form that lenders require. It might look serious, but I've got good news—most of it is already filled out from what you told me earlier!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Now we're moving to the Home Journey section—the official URLA 1003 form. This is what lenders need, but here's the cool part: I've already pre-filled most of it with your information!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Let's check out the Home Journey! This is the URLA 1003 form—the standard mortgage application form. The best part? I've already transferred all your info from Prep4Loan, so you won't have to start over!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Here we go—the Home Journey! This is the official URLA 1003 form that lenders use. But here's what makes it special: I've already filled in most of it using the information you provided earlier!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Time to see the Home Journey! This is the URLA 1003 form—the official mortgage application. The good news? I've already pre-populated it with everything you told me in Prep4Loan. No duplicate work!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Alright, let's move to the Home Journey section. This is the URLA 1003 form that lenders need. But here's the magic: I've already transferred all your information, so you're mostly done already!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Now for the Home Journey! This is the official URLA 1003 form—the standard application lenders use. The best part? I've already filled in most of it with your Prep4Loan data. You're ahead of the game!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Let's check out the Home Journey section! This is the URLA 1003 form that all lenders require. Here's what's awesome: I've already pre-filled it with everything from your Prep4Loan application!",
      navigateTo: 'form1003'
    },
    {
      time: 40,
      action: "Click 'Home Journey' (URLA 1003)",
      text: "Time for the Home Journey! This is the official URLA 1003 form. But here's the cool thing—I've already moved all your information over from Prep4Loan, so you won't have to type everything again!",
      navigateTo: 'form1003'
    }
  ],
  // Step 6: Scrolling Form - Pre-filled Data
  6: [
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
    text: "But guess what? You don't have to type it all again! I already moved your info over. Lenders love it because it's perfect; you love it because you're done. Easy, right?",
    scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "See all that information already filled in? That's me doing the heavy lifting! I took everything from Prep4Loan and put it right here. Lenders get accurate data, and you save tons of time. Win-win!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "Look at that—most of the form is already done! I transferred all your information from Prep4Loan automatically. Lenders appreciate the accuracy, and you appreciate not having to retype everything. Perfect!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "Check it out—your information is already there! I moved everything over from Prep4Loan, so you don't have to start from scratch. Lenders get clean, accurate data, and you get to skip the repetitive typing. Nice!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "See how much is already filled in? That's the magic of Prep4Loan! I transferred all your information to this form automatically. Lenders love the accuracy, and you love not having to do it twice. Easy peasy!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "Notice all that pre-filled information? That's me working behind the scenes! I took everything from Prep4Loan and put it in the right places here. No duplicate work, no errors—just smooth sailing!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "Look at that—the form is mostly complete! I automatically transferred all your Prep4Loan data here. Lenders get exactly what they need, and you get to skip the tedious retyping. That's efficiency!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "See all that information already there? That's the power of Prep4Loan! I moved everything over automatically, so you don't have to type it all again. Lenders get accurate data, you save time. Everyone wins!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "Check it out—most of the form is done! I transferred all your information from Prep4Loan, so you're not starting over. Lenders appreciate the precision, and you appreciate the time saved. Perfect setup!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "Look at that pre-filled form! I took everything from Prep4Loan and put it right where it needs to be. No retyping, no mistakes—just clean, accurate data that lenders love. That's how it should be!",
      scrollTarget: "form-content"
    },
    {
      time: 48,
      action: "Scrolling Form - Pre-filled Data",
      text: "See how much is already filled in? That's me doing the work for you! I transferred all your Prep4Loan information here automatically. Lenders get what they need, and you get to skip the repetition. Easy!",
      scrollTarget: "form-content"
    }
  ]
};

// Script rotation system - tracks used scripts with timestamps
const SCRIPT_ROTATION_KEY = 'bella_demo_script_rotation';
const ROTATION_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

interface ScriptUsage {
  stepIndex: number;
  scriptIndex: number;
  timestamp: number;
}

const getScriptRotation = (): ScriptUsage[] => {
  try {
    const stored = localStorage.getItem(SCRIPT_ROTATION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load script rotation data:', e);
  }
  return [];
};

const saveScriptRotation = (usage: ScriptUsage[]) => {
  try {
    localStorage.setItem(SCRIPT_ROTATION_KEY, JSON.stringify(usage));
  } catch (e) {
    console.warn('Failed to save script rotation data:', e);
  }
};

const getAvailableScripts = (stepIndex: number): number[] => {
  const now = Date.now();
  const rotation = getScriptRotation();
  
  // Filter out scripts used within the last 30 minutes
  const recentlyUsed = new Set(
    rotation
      .filter(u => u.stepIndex === stepIndex && (now - u.timestamp) < ROTATION_COOLDOWN_MS)
      .map(u => u.scriptIndex)
  );
  
  const allScripts = demoScriptVariations[stepIndex] || [];
  const available = allScripts
    .map((_, index) => index)
    .filter(index => !recentlyUsed.has(index));
  
  // If all scripts were recently used, reset and use all of them
  if (available.length === 0) {
    console.log(`All scripts for step ${stepIndex} were recently used. Resetting rotation.`);
    return allScripts.map((_, index) => index);
  }
  
  return available;
};

const selectScript = (stepIndex: number): DemoScriptStep => {
  const available = getAvailableScripts(stepIndex);
  const scripts = demoScriptVariations[stepIndex] || [];
  
  // Randomly select from available scripts
  const randomIndex = available[Math.floor(Math.random() * available.length)];
  const selectedScript = scripts[randomIndex];
  
  // Record usage
  const rotation = getScriptRotation();
  rotation.push({
    stepIndex,
    scriptIndex: randomIndex,
    timestamp: Date.now()
  });
  
  // Clean up old entries (older than 30 minutes)
  const now = Date.now();
  const cleaned = rotation.filter(u => (now - u.timestamp) < ROTATION_COOLDOWN_MS);
  saveScriptRotation(cleaned);
  
  console.log(`🎲 Selected script ${randomIndex + 1}/${scripts.length} for step ${stepIndex} (${available.length} available)`);
  
  return selectedScript;
};

// Get the current demo script with rotation
const getDemoScript = (): DemoScriptStep[] => {
  return [0, 1, 2, 3, 4, 5, 6].map(stepIndex => selectScript(stepIndex));
};

interface DemoControllerProps {
  onNavigateTo?: (view: 'home' | 'prep' | 'form1003' | 'documents') => void;
  onFillData?: (data: Record<string, any>) => void;
  onEndDemo?: () => void;
  currentView?: 'home' | 'prep' | 'form1003' | 'documents';
}

const DemoController: React.FC<DemoControllerProps> = ({ 
  onNavigateTo, 
  onFillData,
  onEndDemo,
  currentView = 'home'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const demoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [demoScript, setDemoScript] = useState<DemoScriptStep[]>([]);
  
  // Initialize demo script with rotation on mount
  useEffect(() => {
    const script = getDemoScript();
    setDemoScript(script);
    console.log('🎬 Demo script initialized with rotation:', script.map(s => s.action));
  }, []);

  useEffect(() => {
    // Initialize Audio Context - use default sample rate for better compatibility
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
      console.log("✅ Audio context initialized for demo");
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (demoScript.length === 0) return; // Wait for script to be initialized
    
    if (isPlaying && currentStep < demoScript.length) {
      playStep(currentStep);
    } else if (currentStep >= demoScript.length) {
      setIsPlaying(false);
      if (onEndDemo) {
        onEndDemo();
      }
    }
  }, [isPlaying, currentStep, demoScript]);

  // Wait for element to appear with retries
  const waitForElement = async (selector: string, maxRetries = 10, delay = 200): Promise<HTMLElement | null> => {
    for (let i = 0; i < maxRetries; i++) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return null;
  };

  // Highlight element for demo visualization
  const highlightElement = (element: HTMLElement) => {
    const originalStyle = element.style.cssText;
    element.style.transition = 'all 0.3s ease';
    element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
    element.style.transform = 'scale(1.02)';
    element.style.zIndex = '9999';
    
    setTimeout(() => {
      element.style.cssText = originalStyle;
    }, 2000);
  };

  const performStepActions = async (step: DemoScriptStep) => {
    // Navigate if needed
    if (step.navigateTo && onNavigateTo) {
      console.log(`🎬 Demo: Navigating to ${step.navigateTo}`);
      onNavigateTo(step.navigateTo);
      // Wait longer for navigation and DOM to update
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Fill data if needed
    if (step.fillData && onFillData) {
      console.log(`🎬 Demo: Filling data`, step.fillData);
      onFillData(step.fillData);
      // Wait for data to be applied
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Click button if needed (do this before scrolling for better UX)
    if (step.clickTarget) {
      // Wait for button to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], a[role="button"]'));
      const targetButton = buttons.find(btn => {
        const text = btn.textContent?.trim() || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const buttonText = step.clickTarget || '';
        
        return text.toLowerCase().includes(buttonText.toLowerCase()) || 
               ariaLabel.toLowerCase().includes(buttonText.toLowerCase()) ||
               text.toLowerCase() === buttonText.toLowerCase();
      }) as HTMLElement | undefined;
      
      if (targetButton) {
        console.log(`🎬 Demo: Clicking button "${step.clickTarget}"`);
        highlightElement(targetButton);
        await new Promise(resolve => setTimeout(resolve, 500));
        targetButton.click();
        // Wait for click action to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn(`🎬 Demo: Could not find button "${step.clickTarget}"`);
        // Try alternative: if navigating to prep, use direct navigation
        if (step.clickTarget.includes('Pre-Evaluation') && onNavigateTo) {
          console.log(`🎬 Demo: Using direct navigation as fallback`);
          onNavigateTo('prep');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // Scroll if needed
    if (step.scrollTarget) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (step.scrollTarget === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step.scrollTarget === 'sidebar') {
        // Try multiple selectors for sidebar
        const sidebar = await waitForElement('[data-sidebar]') ||
                       await waitForElement('aside') ||
                       document.querySelector('.sidebar') as HTMLElement;
        
        if (sidebar) {
          sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
          highlightElement(sidebar);
        } else {
          // Fallback: scroll to checklist area
          const checklist = document.querySelector('[data-checklist]') || 
                           document.querySelector('.checklist');
          if (checklist) {
            checklist.scrollIntoView({ behavior: 'smooth', block: 'start' });
            highlightElement(checklist as HTMLElement);
          }
        }
      } else if (step.scrollTarget === 'form-content') {
        // Try multiple selectors for form content
        const formContent = await waitForElement('[data-form-content]') ||
                           await waitForElement('main') ||
                           document.querySelector('.form-content') as HTMLElement ||
                           document.querySelector('form') as HTMLElement;
        
        if (formContent) {
          formContent.scrollTo({ top: formContent.scrollHeight, behavior: 'smooth' });
          highlightElement(formContent);
        } else {
          // Fallback: scroll window
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }
    }
  };

  const playStep = async (index: number) => {
    if (index >= demoScript.length) {
      setIsPlaying(false);
      if (onEndDemo) {
        onEndDemo();
      }
      return;
    }

    setCurrentStep(index);
    const step = demoScript[index];
    
    console.log(`🎬 Demo Step ${index + 1}/${demoScript.length}: ${step.action}`);

    // Perform actions first
    await performStepActions(step);

    // Play audio if not muted
    if (!isMuted) {
      setIsLoadingAudio(true);
      try {
        // Resume audio context if suspended (required for autoplay policies)
        if (audioContextRef.current?.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
            console.log("✅ Audio context resumed for demo playback");
          } catch (e) {
            console.warn("⚠️ Could not resume audio context:", e);
          }
        }

        // Use best available voice for demo: OpenAI Nova (best quality) preferred, Gemini Kore as fallback
        // Both are excellent female human-like voices - using auto selection for best quality
        console.log("🎤 Generating speech with best available female human-like voice (OpenAI Nova preferred, Gemini Kore fallback)...");
        const audioData = await generateBellaSpeech(step.text, false); // false = use best available (OpenAI Nova first, then Gemini Kore)
        
        if (audioData && audioContextRef.current) {
          // Properly stop and fade out previous audio to prevent noise
          if (currentSourceRef.current) {
            try {
              // Fade out smoothly before stopping to prevent clicks/pops
              const gainNode = audioContextRef.current.createGain();
              const currentTime = audioContextRef.current.currentTime;
              gainNode.gain.setValueAtTime(1, currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1); // 100ms fade out
              
              // Disconnect old source and connect through gain node
              currentSourceRef.current.disconnect();
              currentSourceRef.current.connect(gainNode);
              gainNode.connect(audioContextRef.current.destination);
              
              // Stop after fade out
              setTimeout(() => {
                try {
                  currentSourceRef.current?.stop();
                  currentSourceRef.current?.disconnect();
                  gainNode.disconnect();
                } catch (e) {
                  // Ignore errors if already stopped
                }
              }, 100);
            } catch (e) {
              // If fade fails, just stop directly
              try {
            currentSourceRef.current.stop();
                currentSourceRef.current.disconnect();
              } catch (stopError) {
                // Ignore if already stopped
              }
            }
            currentSourceRef.current = null;
          }
          
          // Small delay to ensure previous audio is fully stopped
          await new Promise(resolve => setTimeout(resolve, 150));
          
          // Decode audio - handle both OpenAI (MP3) and Gemini (PCM) formats
          let audioBuffer: AudioBuffer;
          try {
            // Check if it's MP3 format (OpenAI) by trying to decode as audio file
            // OpenAI returns base64-encoded MP3, which we can decode directly
            const decodedBytes = decode(audioData);
            
            // Try to decode as MP3 first (OpenAI format)
            try {
              // Create a new ArrayBuffer copy from the Uint8Array to avoid type issues
              const arrayBuffer = decodedBytes.buffer.slice(decodedBytes.byteOffset, decodedBytes.byteOffset + decodedBytes.byteLength) as ArrayBuffer;
              audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
              console.log("✅ Decoded as MP3 (OpenAI format)");
            } catch (mp3Error) {
              // If MP3 decode fails, try as PCM (Gemini format)
              console.log("🔄 Trying PCM format (Gemini)...");
              audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
              console.log("✅ Decoded as PCM (Gemini format)");
            }
          } catch (decodeError: any) {
            console.error("❌ Audio decode error:", decodeError);
            throw new Error(`Failed to decode audio: ${decodeError.message}`);
          }
          
          // Create gain node for smooth fade in/out
          const gainNode = audioContextRef.current.createGain();
          gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
          gainNode.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 0.05); // 50ms fade in
          gainNode.connect(audioContextRef.current.destination);
          
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(gainNode);
          
          source.onended = () => {
            console.log(`✅ Audio playback completed for step ${index + 1}`);
            // Clean up gain node
            try {
              gainNode.disconnect();
            } catch (e) {
              // Ignore if already disconnected
            }
            
            if (isPlaying && currentStep === index) {
              // Calculate delay until next step - use actual audio duration
              const nextStep = demoScript[index + 1];
              const audioDuration = audioBuffer.duration * 1000; // Convert to ms
              const scriptedDelay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
              
              // Use the longer of: remaining scripted time or minimum pause
              const remainingTime = Math.max(scriptedDelay - audioDuration, 0);
              const pauseTime = Math.max(remainingTime, 1000); // Minimum 1 second pause
              
              console.log(`⏱️ Step ${index + 1} completed. Audio: ${audioDuration.toFixed(0)}ms, Pausing ${pauseTime.toFixed(0)}ms before next step`);
              
              stepTimeoutRef.current = setTimeout(() => {
             if (isPlaying) {
                  playStep(index + 1);
                }
              }, pauseTime);
             }
          };
          
          console.log(`🎵 Starting audio playback for step ${index + 1} (duration: ${audioBuffer.duration.toFixed(2)}s)`);
          try {
            source.start(0);
          currentSourceRef.current = source;
            setIsLoadingAudio(false);
          } catch (playError: any) {
            console.error("❌ Audio playback error:", playError);
            setIsLoadingAudio(false);
            // Clean up on error
            try {
              gainNode.disconnect();
            } catch (e) {
              // Ignore
            }
            // Continue to next step even if audio fails
            const nextStep = demoScript[index + 1];
            const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
            stepTimeoutRef.current = setTimeout(() => {
              if (isPlaying) {
                playStep(index + 1);
              }
            }, delay);
          }
        } else {
          console.error("❌ No audio data received");
          setIsLoadingAudio(false);
          // Continue even if audio generation fails
          const nextStep = demoScript[index + 1];
          const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
          stepTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
              playStep(index + 1);
            }
          }, delay);
        }
      } catch (error) {
        console.error("❌ Error playing audio:", error);
        setIsLoadingAudio(false);
        // Continue even if audio fails
        const nextStep = demoScript[index + 1];
        const delay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
        stepTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            playStep(index + 1);
          }
        }, delay);
      }
    } else {
      // If muted, still advance after delay (estimate text reading time)
      const nextStep = demoScript[index + 1];
      const estimatedReadingTime = Math.max(step.text.length * 50, 3000); // ~50ms per character, min 3s
      const scriptedDelay = nextStep ? (nextStep.time - step.time) * 1000 : 2000;
      const delay = Math.max(estimatedReadingTime, scriptedDelay);
      
      stepTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          playStep(index + 1);
        }
      }, delay);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (currentSourceRef.current && audioContextRef.current) {
        try {
          // Fade out smoothly before stopping
          const gainNode = audioContextRef.current.createGain();
          const currentTime = audioContextRef.current.currentTime;
          gainNode.gain.setValueAtTime(1, currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
          
          currentSourceRef.current.disconnect();
          currentSourceRef.current.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          setTimeout(() => {
            try {
              currentSourceRef.current?.stop();
              currentSourceRef.current?.disconnect();
              gainNode.disconnect();
            } catch (e) {
              // Ignore if already stopped
            }
          }, 100);
        } catch (e) {
          // Fallback: just stop directly
          try {
        currentSourceRef.current.stop();
            currentSourceRef.current.disconnect();
          } catch (stopError) {
            // Ignore if already stopped
          }
        }
        currentSourceRef.current = null;
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    } else {
      // Resume audio context on user interaction (required for autoplay policies)
      if (audioContextRef.current?.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          console.log("✅ Audio context resumed on play button click");
        } catch (e) {
          console.warn("⚠️ Could not resume audio context:", e);
        }
      }
      
      setIsPlaying(true);
      if (currentStep >= demoScript.length) {
        setCurrentStep(0);
      }
    }
  };

  const nextStep = () => {
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    if (currentSourceRef.current && audioContextRef.current) {
      try {
        // Fade out smoothly before stopping
        const gainNode = audioContextRef.current.createGain();
        const currentTime = audioContextRef.current.currentTime;
        gainNode.gain.setValueAtTime(1, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
        
        currentSourceRef.current.disconnect();
        currentSourceRef.current.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        setTimeout(() => {
          try {
            currentSourceRef.current?.stop();
            currentSourceRef.current?.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Ignore if already stopped
          }
          currentSourceRef.current = null;
          playStep(currentStep + 1);
        }, 100);
      } catch (e) {
        // Fallback: just stop directly
        try {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
        } catch (stopError) {
          // Ignore if already stopped
        }
        currentSourceRef.current = null;
        playStep(currentStep + 1);
      }
    } else {
    playStep(currentStep + 1);
    }
  };

  const stopDemo = () => {
    setIsPlaying(false);
    if (currentSourceRef.current && audioContextRef.current) {
      try {
        // Fade out smoothly before stopping
        const gainNode = audioContextRef.current.createGain();
        const currentTime = audioContextRef.current.currentTime;
        gainNode.gain.setValueAtTime(1, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
        
        currentSourceRef.current.disconnect();
        currentSourceRef.current.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        setTimeout(() => {
          try {
            currentSourceRef.current?.stop();
            currentSourceRef.current?.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Ignore if already stopped
          }
        }, 100);
      } catch (e) {
        // Fallback: just stop directly
        try {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
        } catch (stopError) {
          // Ignore if already stopped
        }
      }
      currentSourceRef.current = null;
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
    }
    if (onEndDemo) {
      onEndDemo();
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (currentSourceRef.current && audioContextRef.current) {
      try {
        // Fade out smoothly before stopping
        const gainNode = audioContextRef.current.createGain();
        const currentTime = audioContextRef.current.currentTime;
        gainNode.gain.setValueAtTime(1, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
        
        currentSourceRef.current.disconnect();
        currentSourceRef.current.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        setTimeout(() => {
          try {
            currentSourceRef.current?.stop();
            currentSourceRef.current?.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Ignore if already stopped
          }
        }, 100);
      } catch (e) {
        // Fallback: just stop directly
        try {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
        } catch (stopError) {
          // Ignore if already stopped
        }
      }
      currentSourceRef.current = null;
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    // Regenerate script with rotation for fresh variety
    const newScript = getDemoScript();
    setDemoScript(newScript);
    console.log('🔄 Demo script regenerated with rotation');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-6 z-50 bg-white/95 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl p-4 w-80 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-primary text-lg">Bella Live Demo</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            onClick={stopDemo}
            className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-full transition-colors"
            aria-label="Close demo"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="mb-4 min-h-[60px]">
        <p className="text-sm text-gray-700 italic leading-relaxed">
          {isLoadingAudio ? (
            <span className="text-primary">🎤 Bella is speaking...</span>
          ) : (
            `"${demoScript[currentStep]?.text || ''}"`
          )}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={nextStep}
          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-all"
          aria-label="Skip to next step"
        >
          <SkipForward size={24} />
        </button>
        <button
          onClick={resetDemo}
          className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
        >
          Reset
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          Step {currentStep + 1}/{demoScript.length}
        </span>
        <span className="text-gray-400 font-medium">
          {demoScript[currentStep]?.action || 'Demo Complete'}
        </span>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex gap-1">
          {demoScript.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded-full transition-all ${
                idx === currentStep 
                  ? 'bg-primary' 
                  : idx < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DemoController;

