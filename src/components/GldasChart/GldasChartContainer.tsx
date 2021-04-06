import * as React from 'react';
import styled from 'styled-components';
import { max, min } from 'd3';

import {
    GldasIdentifyTaskResults
} from '../../services/GLDAS/gldas';

import {
    GldasLayerName
} from '../../types';

import SvgContainer from './SvgContainer';
import Header from './Header';
import Axis from './Axis';
import StackedArea from './StackedArea';




import {
    TimeExtentItem
} from '../App/App';
import AppContextProvider from '../../contexts/AppContextProvider';
import Bar from './Bar';
import Line from './Line';



//'Water Storage'; Stacked Area showing Soil Moisture and Snowpack Date
// 'Water Flux: Bar and Line showing precip evapo and runoff date
type ChartType = 'Water Storage' | 'Water Flux' | 'Change in Storage';

const ChartTypeLookup: {
    [key in GldasLayerName] : ChartType
} = {
    'Soil Moisture':'Water Storage',
    'Snowpack': 'Water Storage',
    'Precipitation': 'Water Flux',
    'Evapotranspiration': 'Water Flux',
    'Runoff': 'Water Flux',
    'Change in Storage': 'Change in Storage'
};

const GldasChartContainerDiv = styled.div`
    positoin: relative;
    /* max-width: 1000px; */
    flex-grow: 1l
    flex-shrink: 1;
    /* flex-basis: 600px;*/
    flex: autol;
    height: 100%;
`;

interface Props {
    data: GldasIdentifyTaskResults;
    timeExtent: Date[];
    activeLayer: GldasLayerName;

    selectedTimeExtentItem: TimeExtentItem;
    previewTimeExtentItem: TimeExtentItem;

    selectedItemOnChange: (d:TimeExtentItem) => void;
    previewItemOnChange: (d: TimeExtentItem) => void;
}

const GldasChartContainer: React.FC<Props> = ({
    data,
    timeExtent,
    activeLayer,

    selectedTimeExtentItem,
    previewTimeExtentItem,

    selectedItemOnChange,
    previewItemOnChange,
}) => {

    const getYDomain = () => {
        if(!data){
            return [0, 0];
        }

        const chartType = ChartTypeLookup[activeLayer];

        if( chartType === 'Water Storage'){

            const maxSoilMoisture = max(data['Soil Moisture'].map(d => d.value));
            const maxSnowpack = max(data.Snowpack.map(d => d.value));

            return [0, maxSoilMoisture + maxSnowpack];
        }

        if( chartType === 'Change in Storage') {

            const allValues = data['Change in Storage'].map(d => d.value);
            const minVal = min(allValues);
            const maxVal = max(allValues);

            return [minVal, maxVal];
        }

        const maxPrecip = max(data.Precipitation.map(d => d.value));
        const maxEvapo = max(data.Evapotranspiration.map(d => d.value));
        const maxRunoff = max(data.Runoff.map(d => d.value));

        return [0, max([maxPrecip, maxEvapo, maxRunoff])];
    };

    const getDataForStackedArea = () => {

        return data && ChartTypeLookup[activeLayer] === 'Water Storage'
            ? {
                'Soil Moisture' : data['Soil Moisture'],
                'Snowpack' : data['Snowpack']
            }
            : null;
    };

    const getDataForBar = () => {
        if(!data || ChartTypeLookup[activeLayer] !== 'Water Flux'){
            return null;
        }

        return ( activeLayer === 'Precipitation' || activeLayer === 'Runoff')
            ? data.Runoff
            : data.Evapotranspiration;
    };

    const getDataForLines = ()=> {

        if(!data || ChartTypeLookup[activeLayer] !== 'Water Flux'){
            return null;
        }

        return (activeLayer === 'Precipitation' || activeLayer === 'Runoff')
            ? data.Runoff
            : data.Evapotranspiration;
    };

    return (
        <GldasChartContainerDiv>
            <Header activeLayer={activeLayer}/>
            <SvgContainer
                timeExtent={timeExtent}
                yDomain={getYDomain()}
            >
                <StackedArea 
                    data={getDataForStackedArea()}
                />
                
                <Bar
                    data={getDataForBar()}
                    isDiverging={activeLayer === 'Change in Storage'}
                />
                <Line
                    data={getDataForLines()}
                />
                <Axis />

            </SvgContainer>
            
        </GldasChartContainerDiv>
    );
};

export default GldasChartContainer;






