import React from 'react';
import { DeleteButton, SaveButton, Toolbar } from 'react-admin';


const ModelFightEditToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="Save"
            submitOnEnter={true}
        />
        <SaveButton
            label="Save and Continue Editing"
            redirect={false}
            submitOnEnter={false}
            variant="flat"
        />
        <DeleteButton />
    </Toolbar>
);

export default ModelFightEditToolbar;