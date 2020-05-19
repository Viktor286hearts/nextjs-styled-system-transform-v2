import React from 'react';
import { layout } from 'styled-system'
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';

const theme = {
	sizes: 5,
};

const BoxWithScaledCSSProps = styled.div`
    display: inline-block;
    border: 1px solid red;
    ${layout}
`;

const BoxWithDefaultCSSProps = styled.div`
    display: inline-block;
    border: 1px solid blue;
    ${layout}
`;

export default function Index() {
	return (
		<ThemeProvider theme={theme}>
			<BoxWithScaledCSSProps
				width={100}
				height={.25}
				minWidth={.3}
				minHeight={.4}
				maxWidth={.5}
				maxHeight={.6}
			>
				<p>Hello Next.js</p>
			</BoxWithScaledCSSProps>
			<BoxWithDefaultCSSProps
				width='auto'
				height='75%'
				minWidth='40ch'
				minHeight='100px'
				maxWidth='99%'
				maxHeight='99%'
			>
				<p>BoxWithDefaultCSSProps</p>
			</BoxWithDefaultCSSProps>
		</ThemeProvider>
	);
}
