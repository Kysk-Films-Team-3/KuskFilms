import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from '../services/api';

export const PaymentSuccess = ({ onProfileUpdate }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const updateProfileAndRedirect = async () => {
            try {
                const profile = await fetchUserProfile();
                
                const updatedProfile = {
                    ...profile,
                    isPremium: true
                };
                
                if (onProfileUpdate) {
                    onProfileUpdate(updatedProfile);
                }
            } catch (error) {
                const fallbackProfile = {
                    isPremium: true
                };
                
                if (onProfileUpdate) {
                    onProfileUpdate(fallbackProfile);
                }
            }
            
            navigate("/", { replace: true });
        };

        updateProfileAndRedirect();
    }, [navigate, onProfileUpdate]);

    return null;
};
