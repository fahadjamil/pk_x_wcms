import React from "react";
import { TableUiComponent } from "../TableComponent";
import { SpecificPreviewComponent } from "../../SpecificPreviewComponent";
import { appServerURL } from "../../../config/path";

export const ExecutiveTeam = (props) => {
  const { commonConfigs } = props;
  const settingsAccumulatedLoss = {
    columns: [
      { columnName: "", dataType: "link", mappingField: "name" },
      { columnName: "", dataType: "text", mappingField: "designation" },
    ],
    showColumnTitle: true,
    httpRequest: {
      dataSource: appServerURL("executive_team"),
      header: {},
    },
  };

  return commonConfigs.isPreview ? (
    <SpecificPreviewComponent title="Executive Team Table" />
  ) : (
    <TableUiComponent
      componentSettings={settingsAccumulatedLoss}
    ></TableUiComponent>
  );
};
