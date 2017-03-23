import styled from 'styled-components/native';
import Colors from '../utils/Colors';

const ColorBackground = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${props => props.condition ? Colors.identifyBackground(props.condition, props.day) : '#999'};
`;

export default ColorBackground;
