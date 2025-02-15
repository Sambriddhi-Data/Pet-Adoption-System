'use client'

import ProgressBar from "./progress-bar";
import BasicDetails from "./basic-details";
import usePetRegistrationStore from "./store";
import PersonalityDetails from "./personality-details";
import HealthDetails from "./health-details";
import ReviewSubmit from "./review";

export default function AddPet() {

    const { step } = usePetRegistrationStore();

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicDetails/>;
            case 2:
                return <HealthDetails/>;
            case 3:
                return <PersonalityDetails />;
              case 4:
                return <ReviewSubmit />;
            default:
                return null;
        }
    };

    return (
        <main>
            <ProgressBar />
            {/* steps */}
            <div>{renderStep()}</div>
            
        </main>
    );
}
