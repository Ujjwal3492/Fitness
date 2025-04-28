import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import TrainerRoutes from "./routes/trainer.routes.js";

import { Lead } from "./models/Lead.js";

const app= express()

app.use(cors());

app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))


//routes
app.use("/api/v1/Trainer" , TrainerRoutes)
import videoroute from './routes/testimonialRoutes.js';

app.use('/api/v1/testimonials', videoroute);



app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = 'Ujjwalsoni12345678910';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});


app.post('/webhook', async (req, res) => {
    const messages = req.body.entry[0].changes[0].value.messages;

    // Loop through each incoming message
    for (let msg of messages) {
        const { from, text } = msg;

        // Only handle messages starting with '#feedback'
        if (text && text.body && text.body.startsWith('#feedback')) {
            const phoneNumberMasked = `${from.substring(0, 3)}********${from.substring(8)}`;
            const phoneNumberHash = require('crypto').createHash('sha256').update(from).digest('hex'); // Hash phone number for privacy
            
            // Save feedback to MongoDB
            try {
                const lead = new Lead({
                    name: msg.contacts[0].profile.name || 'Unknown',
                    phoneNumberHash,
                    phoneNumberMasked,
                    lastMessage: text.body,
                    receivedAt: new Date(),
                    updatedAt: new Date()
                });

                await lead.save();
                console.log('Feedback saved to MongoDB:', text.body);
            } catch (err) {
                console.error('Error saving feedback:', err);
            }
        }
    }

    // Respond to Meta that the message was processed successfully
    res.status(200).send('EVENT_RECEIVED');
});


export {app} 