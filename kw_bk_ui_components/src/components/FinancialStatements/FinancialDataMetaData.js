import React from "react";
import styled from "styled-components";
import { getArabicShortFullDate, getShortFullDate } from "../../helper/date";

const MetaDataWrapper = styled.div`
  margin-bottom: 20px;
`;
export const FinancialDataMetaData = (props) => {
  
  let generalInfo = props && props.generalInfo;
  let currency = (generalInfo && generalInfo.currency) || "";
  let publishedDate = (generalInfo && generalInfo.publishedOn) || "";
  const { lang } = props;

  const convertByLang = (arText, enText) =>
    lang.langKey === "AR" ? arText : enText;

  return (
    <MetaDataWrapper>
      {" "}
      {convertByLang("العملة", "Currency")} : <strong>{currency}</strong>{" "}
      {convertByLang(" تاريخ النشر", "Published On")} :{" "}
      <strong>{convertByLang(getArabicShortFullDate(publishedDate), getShortFullDate(publishedDate))}</strong>
    </MetaDataWrapper>
  );
};
