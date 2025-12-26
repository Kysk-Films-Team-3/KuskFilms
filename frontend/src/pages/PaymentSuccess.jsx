import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from '../services/api';

export const PaymentSuccess = ({ onProfileUpdate }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const updateProfileAndRedirect = async () => {
            try {
                let profile = await fetchUserProfile();
                
                if (onProfileUpdate) {
                    onProfileUpdate(profile);
                }
                
                if (!profile.isPremium) {
                    const maxAttempts = 5;
                    const delayMs = 1500;
                    
                    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                        
                        try {
                            profile = await fetchUserProfile();
                            if (onProfileUpdate) {
                                onProfileUpdate(profile);
                            }
                            
                            if (profile.isPremium) {
                                break;
                            }
                        } catch (err) {
                            console.error(`Error reloading profile (attempt ${attempt}):`, err);
                        }
                    }
                }
                
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1000);
                
            } catch (error) {
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1000);
            }
        };

        updateProfileAndRedirect();
    }, [navigate, onProfileUpdate]);

    return null;
};
