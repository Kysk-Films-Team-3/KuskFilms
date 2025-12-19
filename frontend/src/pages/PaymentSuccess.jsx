import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from '../services/api';

export const PaymentSuccess = ({ onProfileUpdate }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const updateProfileAndRedirect = async () => {
            try {
                const profile = await fetchUserProfile();
                
                if (onProfileUpdate) {
                    onProfileUpdate(profile);
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
