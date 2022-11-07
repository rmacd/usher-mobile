import React from "react";

// displays all permissions for a particular app
export const ManagePermissions = (props: {projectId: string | undefined}) => {

    if (!props.projectId) {
        return (<></>);
    }

    return (
        <>

        </>
    );
};
