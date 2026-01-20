import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function createUser(req, res) {

    const passwordHash = bcrypt.hashSync(req.body.password,10)

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash

        
    }

    const user = new User(userData);

    user.save().then(
        () => {
            res.json({
                message: "User created successfully"
            })
             
    }).catch(
        () => {
             res.json({
                  message: "Failed to create user",
            });    
        }
    ) 
}

export function loginUser(req, res) {
    const email = req.body.email

    const password= req.body.password

   User.findOne(
        {
            email: email
        }
    ).then(
        (user) => {
            const genericErrorMessage = "Invalid email or password"; // Generic message for security

            if(user == null) {
                // User not found - return generic error
                res.status(401).json({
                    message: genericErrorMessage
                })
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password)
                if(isPasswordCorrect) {


                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isBlocked : user.isBlocked,
                            isEmailVerified : user.isEmailVerified,
                            image : user.image
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn : "1d"
                        }
                    )    
                    

                    // Trigger n8n webhook (fire and forget)
                    const webhookPayload = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                    console.log('Preparing to send webhook payload:', webhookPayload);

                    fetch('https://bpasindu.app.n8n.cloud/webhook-test/user-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(webhookPayload)
                    }).then(response => {
                        console.log('Webhook sent. Status:', response.status);
                    }).catch(err => {
                        console.error('Failed to trigger n8n login webhook:', err);
                    });

                    res.json({
                        token : token,
                        message: "Login successful"
                    })
                } else {
                     // Incorrect password - return generic error (same as user not found)
                    res.status(401).json({
                        message: genericErrorMessage
                    })
                }
           }
        }
    )

}

export function isAdmin(req){

    if(req.user == null){
        return false;
    }

    if(req.user.role == 'admin'){
        return true;

    } else {
        return false;
    }
}