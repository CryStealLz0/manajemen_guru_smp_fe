import { useState } from 'react';

export function useTabsState(initial = 'admin') {
    const [tab, setTab] = useState(initial);
    return { tab, setTab };
}

export function useSubTabsState(initial = 'master') {
    const [sub, setSub] = useState(initial);
    return { sub, setSub };
}
