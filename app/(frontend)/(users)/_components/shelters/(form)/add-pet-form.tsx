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
                return <BasicDetails isEditing = {false} />;
            case 2:
                return <HealthDetails isEditing = {false}/>;
            case 3:
                return <PersonalityDetails isEditing = {false}/>;
              case 4:
                return <ReviewSubmit isEditing = {false} />;
            default:
                return null;
        }
    };

    return (
        <main>
            <ProgressBar/>
            {/* steps */}
            <div>{renderStep()}</div>
            
        </main>
    );
}
