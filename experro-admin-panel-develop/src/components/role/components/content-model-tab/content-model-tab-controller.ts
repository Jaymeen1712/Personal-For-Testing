import { useState } from "react";
import { ContentModelIndeterminateState } from "../../../../types";




const useContentModelTabController = () => {
    const [indeterminateStates, setIndeterminateStates] = useState<ContentModelIndeterminateState>({
        read : false,
        update : false,
        delete : false
    });

    return{
        indeterminateStates,
        setIndeterminateStates
    }
}

export default useContentModelTabController