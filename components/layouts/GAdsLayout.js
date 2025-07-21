import React, { useState } from "react";
import SimpleHeader from "../parts/SimpleHeader";




function GAdsLayout({ children }) {



    return (


        <div>
            <SimpleHeader />
            <main>{children}</main>
        </div>



    );
}

export default GAdsLayout
