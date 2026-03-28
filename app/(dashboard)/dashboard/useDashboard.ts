// "use client"
import { useState } from "react"
import { UserType } from "./dashboard.types";
import { userProfiles, chartData, legendItems, onboardingSteps } from "./mockdata"


export const useDashboard = () => {
    const [userType, setUserType] = useState<UserType>("new");
    const [copied, setCopied] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false)

    const profile = userProfiles[userType];
    const url = "https://bimanage.com.ng";

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const toggleOnboarding = () => setShowOnboarding((prev) => !prev)
    const toggleUserType = () => setUserType((prev) => (prev === "new" ? "existing" : "new"))


    return {
        // state
        userType, copied, showOnboarding, profile, url,

        // Static data
        chartData, legendItems, onboardingSteps,

        // handlers
        handleCopy, toggleOnboarding, toggleUserType,
    };
};