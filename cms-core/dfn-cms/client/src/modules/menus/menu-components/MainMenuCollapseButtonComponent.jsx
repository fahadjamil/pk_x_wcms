import React from 'react';
import AddMenuItem from './AddMenuItem';

export default function MainMenuCollapseButtonComponent(params) {
    return (
        <>
            <div>
                <p>
                    <a
                        class="btn btn-primary ml-2"
                        data-toggle="collapse"
                        href="#multiCollapseExample1"
                        role="button"
                        aria-expanded="false"
                        aria-controls="multiCollapseExample1"
                    >
                        + Add New Main Menu
                    </a>
                </p>
                <div class="">
                    <div class="col">
                        <div class="collapse multi-collapse" id="multiCollapseExample1">
                            <div class="card card-body">
                               <AddMenuItem />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
