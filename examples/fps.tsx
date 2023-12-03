import React, { useState, useRef, useEffect } from 'react';
import { useFps } from 'react-fps';
import { Group, Rect, Text } from '../src/index';

export function FPS() {
	const [dims, setDims] = useState({ width: 0, height: 0 });
	const windowWidth = 15;
	const fps = useFps(15);
	const width = windowWidth * 5;
	const height = 66;
	return (
		<Group
			width={width}
			height={height}
			left={dims.width - width}
			top={dims.height - height}
			ref={(r) => {
				if (!r || !r.canvas) return;
				if (dims.width !== r.canvas.width) {
					setDims({
						width: r.canvas.width!,
						height: r.canvas.height!,
					});
				}
			}}
		>
			<Rect
				width={width}
				height={height}
				fill="blue"
				top={-height / 2}
				left={-width / 2}
			/>
			{fps.fps.map((val, i) => {
				const h = (val / fps.maxFps) * 40;
				const top = -height / 2 + 26 + (40 - h);
				return (
					<Rect
						key={i}
						fill="rgb(38, 240, 253)"
						width={4}
						height={h}
						left={-width / 2 + i * 5}
						top={top}
					/>
				);
			})}
			{typeof fps.currentFps === 'number' ? (
				<Text
					fontSize={16}
					fontFamily="Geist Mono (Beta)"
					fill="rgb(38, 240, 253)"
					originX="center"
					originY="center"
					top={-height / 2 + 16}
				>
					{fps.currentFps} FPS
				</Text>
			) : null}
		</Group>
	);
}
