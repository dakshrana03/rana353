import React from "react";
import Channels from "./Channels";
import CreateChannel from "./CreateChannel";

function HomePage() {
    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div style={{flex: 1}}>
                <CreateChannel/>
            </div>
            <div style={{flex: 1}}>
                <Channels/>
            </div>
        </div>
    );
}

export default HomePage;
