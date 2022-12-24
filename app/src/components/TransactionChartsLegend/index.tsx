/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useContext } from 'react';
import Context from "../../context";

import { Category } from "../../utils/types";

const TransactionChartsLegend: React.FC = () => {
  const { allCategories, lightMode } = useContext(Context);

  const getLegend = (category: string) => {
    if (!Category?.Colors[lightMode ? 'Light' : 'Dark']?.has(category)) {
      return <></>;
    }
    return `⚫ ${category}`;
  };

  const getLegendStyle = (category: string) => {
    return {
      color: 'transparent',
      textShadow: `0 0 0 ${Category?.Colors[lightMode ? 'Light' : 'Dark']?.get(category) ? Category?.Colors[lightMode ? 'Light' : 'Dark']?.get(category) : ""}`,
    };
  };

  return (
    <div className="row" css={{alignContent: "center", textAlign: 'left'}}>
      {allCategories.map((category: string) => {
        return (
          <div className="col-lg-2 col-md-3 col-sm-6 col-6" style={getLegendStyle(category)} key={category}>
            <span>
              {getLegend(category)}
            </span>
          </div>
        );
      })}
    </div>
  )
};

export default TransactionChartsLegend;