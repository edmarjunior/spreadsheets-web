import React from 'react';
import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashbord';

export default function Routes() {
    return (
        <Switch>
            <Route to="/" exact component={Dashboard} />
        </Switch>
    )
}
