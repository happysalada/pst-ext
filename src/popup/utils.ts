// Function to get the time difference between now and a given datetime string
export function timeFromNow(datetime: Date): string {
  const now = new Date();

  const milliseconds = now - datetime;
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Average number of days in a month
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years + (years === 1 ? ' year' : ' years') + ' ago';
  } else if (months > 0) {
    return months + (months === 1 ? ' month' : ' months') + ' ago';
  } else if (weeks > 0) {
    return weeks + (weeks === 1 ? ' week' : ' weeks') + ' ago';
  } else if (days > 0) {
    return days + (days === 1 ? ' day' : ' days') + ' ago';
  } else if (hours > 0) {
    return hours + (hours === 1 ? ' hour' : ' hours') + ' ago';
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? ' minute' : ' minutes') + ' ago';
  } else {
    return seconds + (seconds === 1 ? ' second' : ' seconds') + ' ago';
  }
}

type ClickOutsideAction = {
  destroy: () => void;
};

export function clickOutside(node: HTMLElement): ClickOutsideAction {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};

	document.addEventListener("click", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		}
	};
}

export function formatEthAddress(address: string) {
  if (typeof address !== "string" || address.length < 10) {
    return "Loading";
  }

  const firstFour = address.slice(0, 6);
  const lastFour = address.slice(-4);

  return `${firstFour}...${lastFour}`;
}
