import React,  {useEffect} from 'react';
import IPoint from 'esri/geometry/Point';

import {AppContext} from '../../contexts/AppContextProvider';

import MapView from '../MapView/MapView';
import {UIConfig} from '../../AppConfig';
import BottomPanel from '../BottomPanel/BottomPanel';
import ChangeInStorageIndicator from '../ChangeStorageIndicator/ChangeStorageIndicator';

import useGldasData from '../../hooks/useGldasData';


interface Props{};

interface LoadingState{
    isLoading: boolean
}
export interface TimeExtentItem{
    date: Date;
    index: number;
};


const App: React.FC<Props> = ({

}:Props) => {

    const [queryLocation, setQueryLocation] = React.useState<IPoint>();

    const { timeExtentForGldasLayers, isMobile} = React.useContext(AppContext);

    //const [loadingState, setLoadingState] = React.useState<LoadingState>({isLoading:true});

    const [selectedTmeExtendItem, setSelectedTimeExtendItem] = React.useState<TimeExtentItem>();

    const [previewTimeExtentItem, setPreviewTimeExtendItem] = React.useState<TimeExtentItem>();

    const {
        gldasDataResponse,
        isLoading,
        isFailed,
        resetIsFailed,
    } = useGldasData(queryLocation);


    // useEffect(() => {
    //     setTimeout(function(){
    //         setLoadingState({isLoading:false});
    //     }, 5000);
        
    // }, []);
    

    const shouldShowBottomPanel = () => {
        return (gldasDataResponse && !isFailed && !isMobile );
    };

    const getBottomPanel = () => {
        
        if(!shouldShowBottomPanel()){
            return null
        }

        const {gldasData, gldasDataByMonth} = gldasDataResponse;

        return (
            <BottomPanel 
                isLoading={isLoading}
                isMobile={isMobile}
                >
                <ChangeInStorageIndicator 
                data={gldasData} 
                gldasDataByMonth={gldasDataByMonth}
                timeExtentItem={previewTimeExtentItem || selectedTmeExtendItem}/>
            </BottomPanel>
        );
    };

    React.useEffect(() => {
        if(timeExtentForGldasLayers.length){

            const index = timeExtentForGldasLayers.length - 1;
            const date = timeExtentForGldasLayers[index];

            setSelectedTimeExtendItem({
                index,
                date
            });
        }
    }, [timeExtentForGldasLayers]);

    return (

        <>
            <MapView 
                paddingBottom={shouldShowBottomPanel() ? UIConfig['bottom-panel-height'] : 0}
                onClickHandler={setQueryLocation}
            >

            </MapView>
            {getBottomPanel()}
        </>
    );
};

export default App;