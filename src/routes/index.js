import React from 'react';
import { Route, Switch } from 'react-router-dom'

import Apontamentos from '../pages/Apontamentos';

export default function Routes() {
    return (
        <Switch>
            <Route to="/" exact component={Apontamentos} />
            <Route to="/apontamentos" exact component={Apontamentos} />
        </Switch>
    )
}
