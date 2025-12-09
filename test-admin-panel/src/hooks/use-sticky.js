'use client';
import { useEffect, useState } from "react";

const useSticky = () => {
    const [sticky,setSticky] = useState(false);

    const stickyHeader = () => {
        const sc = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (sc > 80) {
            setSticky(true);
        } else {
            setSticky(false);
        }
    }
    useEffect(() => {
        // run once to set initial state
        stickyHeader();

        // use passive listener for better performance
        window.addEventListener('scroll', stickyHeader, { passive: true });

        // cleanup
        return () => {
            try {
                window.removeEventListener('scroll', stickyHeader);
            } catch (e) {
                // ignore
            }
        };
    },[]);

    return {
        sticky,
    }

}

export default useSticky;