import styled, { css } from "styled-components";

/* ////////////////////////////////////////////
                  Spacing
//////////////////////////////////////////// */
export const Spacing = styled.nav<{ spacing?: string }>`
  width: 100%;
  height: ${(props) => (props.spacing ? `${props.spacing}px` : "15px")};
  display: block;
`;

/* ////////////////////////////////////////////
                  Flex
//////////////////////////////////////////// */
export const Flex = styled.div<{
  flex?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  flexWrap?: string;
  cursor?: string;
  padding?: string;
  width?: string;
  height?: string;
  margin?: string;
  textAlign?: string;
  gap?: string;
}>`
  display: flex;

  ${(props) =>
    props.flex &&
    css`
      flex: ${props.flex};
    `};
  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `};
  ${(props) =>
    props.alignItems &&
    css`
      align-items: ${props.alignItems};
    `};
  ${(props) =>
    props.flexDirection &&
    css`
      flex-direction: ${props.flexDirection};
    `}
  ${(props) =>
    props.flexWrap &&
    css`
      flex-wrap: ${props.flexWrap};
    `}
 ${(props) =>
    props.cursor &&
    css`
      cursor: ${props.cursor};
    `};
  ${(props) =>
    props.padding &&
    css`
      padding: ${props.padding};
    `};
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};
  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `};
  ${(props) =>
    props.margin &&
    css`
      margin: ${props.margin};
    `};
  ${(props) =>
    props.textAlign &&
    css`
      text-align: ${props.textAlign};
    `};
  ${(props) =>
    props.gap &&
    css`
      gap: ${props.gap};
    `};
`;
