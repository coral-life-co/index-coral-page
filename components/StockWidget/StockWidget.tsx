import React, { StrictMode, useEffect, useRef, useState } from 'react';
import './StockWidget.css';

// Types
interface StockPrice {
    date: Date;
    value: number;
}

type Status = "error" | "loading" | "ok";

interface IconProps {
    icon: string;
    color?: string;
    size?: string;
}

interface StockWidgetProps {
    symbol: string;
    name?: string;
}

interface StockWidgetErrorProps {
    symbol: string;
}

interface StockWidgetGraphProps {
    data: number[];
}

// Helper function
const randomHash = () => {
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2**32;
    return Math.round(0xffff * random).toString(16);
};

// Components
export const Icon: React.FC<IconProps> = ({ icon, color = "", size = "" }) => {
    const _color = color ? ` icon--${color}` : '';
    const _size = size ? ` icon--${size}` : '';

    return (
        <svg className={`icon${_color}${_size}`} width="16px" height="16px" aria-hidden="true">
            <use href={`#${icon}`} />
        </svg>
    );
};

export const IconSprites: React.FC = () => {
    const viewBox = "0 0 16 16";

    return (
        <svg width="0" height="0" display="none">
            <symbol id="up" viewBox={viewBox}>
                <g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <polyline points="2 8,8 2,14 8" />
                    <polyline points="8 2,8 14" />
                </g>
            </symbol>
            <symbol id="down" viewBox={viewBox}>
                <g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <polyline points="8 2,8 14" />
                    <polyline points="2 8,8 14,14 8" />
                </g>
            </symbol>
            <symbol id="warning" viewBox={viewBox}>
                <g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <polygon points="8 1,15 14,1 14" />
                    <polyline points="8 6,8 10" />
                    <polyline points="8 12,8 12" />
                </g>
            </symbol>
        </svg>
    );
};

const StockWidgetError: React.FC<StockWidgetErrorProps> = ({ symbol }) => {
    return (
        <div className="widget__content">
            <div className="widget__error">
                <Icon icon="warning" color="warning" size="large" />
                <p>Couldn't get data for <strong>{symbol}</strong>. Try again later.</p>
            </div>
        </div>
    );
};

const StockWidgetGraph: React.FC<StockWidgetGraphProps> = ({ data }) => {
    const [animated, setAnimated] = useState(false);
    const animationRef = useRef(0);
	const lowestPrice = data.reduce((a,b) => b < a ? b : a);
	const highestPrice = data.reduce((a,b) => b > a ? b : a);
	const difference = highestPrice - lowestPrice;
	const graphWidth = 105;
	const graphHeight = 90;
	const graphPoints = data.map((n,i) => {
		const x = graphWidth * (i / (data.length - 1));
		let y = (1 - (n - lowestPrice) / difference) * graphHeight;

		if (isNaN(y)) {
			y = graphHeight;
		}

		return [+x.toFixed(2), +y.toFixed(2)];
	});
	const graphPointsDrawn = [
		[-1, graphHeight],
		...graphPoints,
		[graphWidth + 1, graphHeight]
	];
	const graphPointsToString = graphPointsDrawn.map(point => point.join(" ")).join(",");
	const graphClipStyle = {
		transform: `translate(${-graphWidth}px,0)`
	};
	const clipID = `line-clip-${randomHash()}`;

	useEffect(() => {
		// allow the animation to run on mount
		animationRef.current = setTimeout(() => setAnimated(true),400);
	}, []);

	return (
		<svg className="widget__graph" viewBox={`0 0 ${graphWidth} ${graphHeight}`} width={`${graphWidth}px`} height={`${graphHeight}px`} aria-hidden="true">
			<defs>
				<clipPath id={clipID}>
					<rect className="widget__graph-clip" width={graphWidth} height={graphHeight} style={!animated ? graphClipStyle : {}} />
				</clipPath>
			</defs>
			<polyline className="widget__graph-line" clipPath={`url(#${clipID})`} strokeWidth="1" points={graphPointsToString} />
		</svg>
	);

};

const StockWidgetPlaceholder: React.FC = () => {
    return (
        <div className="widget__content">
            <div className="widget__placeholder widget__placeholder--symbol"></div>
            <div className="widget__placeholder widget__placeholder--name"></div>
            <div className="widget__placeholder widget__placeholder--change"></div>
            <div className="widget__placeholder widget__placeholder--price"></div>
        </div>
    );
};

export const StockWidget: React.FC<StockWidgetProps> = ({ symbol, name }) => {
    const [fetching, setFetching] = useState(false);
	const [status, setStatus] = useState<Status>("loading");
	const [data, setData] = useState<StockPrice[]>([]);
	const LOCALE = "en-US";
	const CURRENCY = "USD";
	const currencyFormat = new Intl.NumberFormat(LOCALE, {
		currency: CURRENCY,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		notation: "compact"
	});
	const percentFormat = new Intl.NumberFormat(LOCALE, {
		maximumFractionDigits: 2,
		style: "percent"
	});
	const prices = data.map(price => price.value);
	while (prices.length < 2) {
		// force a minimum of two values
		prices.unshift(0);
	}
	const lastTwo = prices.slice(-2);
	const difference = lastTwo.reduce((a,b) => b - a);
	const ratio = lastTwo.reduce((a,b) => b / a);
	const change = ratio === Infinity ? 1 : (isNaN(ratio) ? 0 : ratio - 1);
	const isDown = difference < 0;
	// formatted values
	const changeAsSymbol = isDown ? "-" : "+";
	const changeAsWord = isDown ? "down" : "up";
	const priceAbs = currencyFormat.format(Math.abs(difference));
	const changeAbs = percentFormat.format(Math.abs(change));
	const visibleLabel = `${changeAsSymbol}${priceAbs} (${changeAsSymbol}${changeAbs})`;
	const ariaLabel = `${changeAsWord} ${priceAbs} points (${changeAbs})`;
	const mostRecentPrice = currencyFormat.format(lastTwo.slice(-1)[0]);

	useEffect(() => {
		// prevent multiple requests for the same data
		setFetching(true);
	}, []);

	useEffect(() => {
		async function fetchData() {
			try {
				// first allow the placeholder to be seen
				await new Promise((res) => setTimeout(res,1e3));
				// then do the request
				const func = "TIME_SERIES_DAILY";
				const apiKey = "demo"; // EFPI1W0IT64YLBB4
				const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apiKey}`;
				const response = await fetch(url);

				if (response.ok) {
					// parameters to get from JSON
					const seriesKey = "Time Series (Daily)";
					const valueKey = "4. close";
					const dayRange = 14;
					const offset = 0;
					// get the JSON
					const result = await response.json();
					const daily = result[seriesKey];
					// use data from the last n days
					const dates = Object.keys(daily).slice(offset,dayRange + offset);
					const dataArray: StockPrice[] = [];
					// build the data array
					dates.forEach(date => {
						dataArray.unshift({
							date: new Date(date),
							value: +daily[date][valueKey]
						});
					});
					setData(dataArray);
					setStatus("ok");
				} else {
					setStatus("error");
				}

			} catch {
				setStatus("error");
			}
		}
		if (fetching) fetchData();

	}, [fetching]);

	const statusMap = {
		error: <StockWidgetError symbol={symbol} />,
		loading: <StockWidgetPlaceholder />,
		ok: <>
			<StockWidgetGraph data={prices} />
			<div className="widget__content">
				<h2 className="widget__symbol">{symbol}</h2>
				<h3 className="widget__name">{name}</h3>
				<div className={`widget__change ${isDown ? "widget__change--negative" : "widget__change--positive"}`} aria-label={ariaLabel}>
					{data.length ? <><Icon icon={changeAsWord} />{visibleLabel}</> : "-"}
				</div>
				<div className="widget__price">
					{data.length ? mostRecentPrice : "-"}
				</div>
			</div>
		</>
	};

	return (
		<div className="widget">{statusMap[status]}</div>
	);
};

// Main App Component
export const StockWidgetApp: React.FC = () => {
    return (
        <StrictMode>
            {/* <IconSprites /> */}
            <div className="widget-grid">
                <StockWidget symbol="IBM" name="IBM" />
                {/* <StockWidget symbol="MSFT" name="Microsoft Corporation" /> */}
            </div>
        </StrictMode>
    );
};