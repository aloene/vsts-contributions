import * as React from "react";
import * as ReactDOM from "react-dom";
import { DelayedFunction } from "VSS/Utils/Core";

import { IUserContributions } from "../data/contracts";
import { getContributions } from "../data/provider";
import { IContributionFilter } from "../filter";
import { Graphs } from "./Graphs";

let renderNum = 0;
export function renderGraphs(filter: IContributionFilter) {
    const graphParent = $(".graphs-container")[0];
    const currentRender = ++renderNum;
    /** Don't show the spinner all the time -- rendering the graph takes about 300 ms */
    const showSpinner = new DelayedFunction(null, 400, "showSpinner", () => {
        if (currentRender === renderNum) {
            const loadingContributions = filter.identities.map((user): IUserContributions => ({key: -1, data: {}, user}));
            ReactDOM.render(<Graphs
                contributions={loadingContributions}
                loading={true}
                sharedScale={false}
            />, graphParent,
            () => {
            });
        }
    });
    showSpinner.start();
    getContributions(filter).then(contributions => {
        showSpinner.cancel();
        if (currentRender === renderNum) {
            ReactDOM.render(<Graphs
                contributions={contributions}
                loading={false}
                sharedScale={filter.sharedScale}
            />, graphParent, () => {
            });
        }
    }, (error) => {
        // tslint:disable-next-line:no-console
        console.error(error);
    });
}
