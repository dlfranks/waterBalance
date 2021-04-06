import React from 'react';
import styled from 'styled-components';




const SummaryCardContainer = styled.div`
width: 230px;
flex-grow: 0;
flex-shrink: 0;
margin-right: 10px;
`;

interface Props{

}

const SummaryCard:React.FC<Props> = () => {


    return (
        <SummaryCardContainer>
            
        </SummaryCardContainer>
    );
};

export default SummaryCard;