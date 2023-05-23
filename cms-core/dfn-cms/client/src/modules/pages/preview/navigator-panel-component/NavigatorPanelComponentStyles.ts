
import styled from 'styled-components';

export const treeViewStyles = {
    root: {
        color: '#FFF',
        fontSize: '1rem',
    },
};

export const treeItemStyles = {
    root: {
        color: '#FFF',
        fontSize: '1rem',
    },
    label: {
        color: '#FFF',
        fontSize: '1rem',
    },
};

export const templateNavigatorStyles = {
    fontSize: '1rem',
    paddingLeft: '0.5rem',
    color: '#66BCFF',
};

export const MainSectionsListContainer = styled.div`
    margin-bottom: 0.5rem;
    margin-top: 2rem;
    display: block;
    // flex-direction: column;
    min-height: auto;
    content: "01";
`;

export const MainSectionsList = styled.ul`
    transition: background-color 0.2s ease;
    list-style: none;
    padding:0;
    background-color: ${(props) => (props.isDraggingOver ? '#66bcff33' : 'none')};
    content: "02";
    border-radius: 0.25rem;
`;

export const ColumnsList = styled.ul`
    list-style: none;
    margin: 0.5rem 0;
    padding-left: 0;
    content: "03";
`;

export const InnerSectionsList = styled.ul`
    transition: background-color 0.2s ease;
    border: ${(props) => (props.isDragging ? '1px solid #FFF' : '1px dashed #ffffff33')};
    margin: 0.5rem;
    list-style: none;
    padding:0;
    background-color: ${(props) => (props.isDraggingOver ? '#66bcff33' : 'none')};
    margin: 0.5rem 0;
    border-radius: 0.25rem;
`;

export const ComponentsList = styled.ul`
    list-style: none;
    padding:0;
    margin: 0.5rem;
    content: "05";
    border-radius: 0.25rem;
`;

export const SectionItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#66bcff33' : 'none')};
    content: "06";
    padding: 0.5rem;
    background: rgba(255,255,255,0.05);
    border-radius: 0.25rem;
`;

export const ColumnItem = styled.li`
    color: #ffffffb3;
    border: none;
    margin: 0.5rem 0;
    padding: 0.5rem 0.5rem 0.125rem 0.5rem;
    content: "07";
    background: rgba(255,255,255,0.05);
    border-radius: 0.25rem;

`;

export const InnerSectionItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '#66bcff33' : 'none')};
    content: "08";
    padding: 0.5rem;
    background: rgba(255,255,255,0.05);
    border-radius: 0.25rem;
`;

export const InnerColumnItem = styled.li`
    color: #ffffffb3;
    border: ${(props) => (props.isDragging ? 'none' : 'none')};
    margin: 0.5rem;
    background-color: ${(props) => (props.isDragging ? '66bcff' : 'none')};
    content: "09";
    padding: 0.5rem;
    background: rgba(255,255,255,0.05);
    border-radius: 0.25rem;
`;

export const ComponentItem = styled.li`
    color: #ffffff66;
    margin: 0.5rem;
    content: "10";
    padding: 0.5rem;
`;

