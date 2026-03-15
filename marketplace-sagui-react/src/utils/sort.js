export const sortMarketItems = (value, list) => {
  if (value === "2") {
    //recentyl created

    const sortedArray = list.sort(orderByRecently);

    return sortedArray;
  }
  if (value === "3") {
    //oldest created
    const sortedArray = list.sort(orderByOldest);

    return sortedArray;
  }
  if (value === "4") {
    let toSortAll = [];
    const forSaleAll = list.filter((item) => item.price !== undefined);
    const auctionAll = list.filter((item) => item.auction !== undefined);
    let leftItemsAll = list.filter((item) => {
      return !forSaleAll.find((forSaleItem) => forSaleItem === item);
    });
    leftItemsAll = leftItemsAll.filter((item) => {
      return !auctionAll.find((auctioned) => auctioned === item);
    });

    toSortAll = [...forSaleAll, ...auctionAll];

    const sortedArrayAll = toSortAll.sort(orderByRecentlyListed);

    let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

    return finalArrayAll;
  }
  if (value === "5") {
    //Lowest price
    let toSortAll = [];
    const forSaleAll = list.filter((item) => item.price !== undefined);
    const auctionAll = list.filter((item) => item.auction !== undefined);
    let leftItemsAll = list.filter((item) => {
      return !forSaleAll.find((forSaleItem) => forSaleItem === item);
    });
    leftItemsAll = leftItemsAll.filter((item) => {
      return !auctionAll.find((auctioned) => auctioned === item);
    });

    toSortAll = [...forSaleAll, ...auctionAll];

    const sortedArrayAll = toSortAll.sort(orderByOldestListed);

    let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

    return finalArrayAll;
  }
  if (value === "6") {
    //highest price
    let toOrderAll = [];
    const forSaleAll = list.filter((item) => item.price !== undefined);
    const offeredAll = list.filter((item) => item.offer !== undefined);
    const auctionAll = list.filter((item) => item.auction !== undefined);

    toOrderAll = [...forSaleAll, ...offeredAll, ...auctionAll];

    let leftItemsAll = list.filter((item) => {
      return !forSaleAll.find((forSaleItem) => forSaleItem === item);
    });
    leftItemsAll = leftItemsAll.filter((item) => {
      return !offeredAll.find((offered) => offered === item);
    });
    leftItemsAll = leftItemsAll.filter((item) => {
      return !auctionAll.find((auctioned) => auctioned === item);
    });

    const sortedArrayAll = toOrderAll.sort(orderByHighestP);

    let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

    return finalArrayAll;
  }
  if (value === "7") {
    //Lowest price
    //highest price
    let toOrderAll = [];
    const forSaleAll = list.filter((item) => item.price !== undefined);
    const offeredAll = list.filter((item) => item.offer !== undefined);
    const auctionAll = list.filter((item) => item.auction !== undefined);

    toOrderAll = [...forSaleAll, ...offeredAll, ...auctionAll];

    let leftItemsAll = list.filter((item) => {
      return !forSaleAll.find((forSaleItem) => forSaleItem === item);
    });
    leftItemsAll = leftItemsAll.filter((item) => {
      return !offeredAll.find((offered) => offered === item);
    });
    leftItemsAll = leftItemsAll.filter((item) => {
      return !auctionAll.find((auctioned) => auctioned === item);
    });

    const sortedArrayAll = toOrderAll.sort(orderByLowestP);

    let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

    return finalArrayAll;
  }
  if (value === "8") {
    const auctionsAll = list.filter((item) => item.auction !== undefined);
    const leftItemsAll = list.filter((item) => {
      return !auctionsAll.find((auction) => auction === item);
    });

    const sortedArrayAll = auctionsAll.sort(orderByNearestEnd);

    let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

    return finalArrayAll;
  }
};

export const orderByOldest = (a, b) => {
  if (a.createdAt < b.createdAt) {
    return -1;
  }
  if (a.createdAt > b.createdAt) {
    return 1;
  }
  return 0;
};

export const orderByRecently = (a, b) => {
  if (a.createdAt > b.createdAt) {
    return -1;
  }
  if (a.createdAt < b.createdAt) {
    return 1;
  }
  return 0;
};

export const orderByRecentlyListed = (a, b) => {
  if (a.auction || b.auction) {
    if (a.auction && !b.auction) {
      if (a.auction.createdAt > b.forSaleAt) {
        return -1;
      }
      if (a.auction.createdAt < b.forSaleAt) {
        return 1;
      }
      return 0;
    }
    if (!a.auction && b.auction) {
      if (a.forSaleAt > b.auction.createdAt) {
        return -1;
      }
      if (a.forSaleAt < b.auction.createdAt) {
        return 1;
      }
      return 0;
    }
    if (a.auction && b.auction) {
      if (a.auction.createdAt > b.auction.createdAt) {
        return -1;
      }
      if (a.auction.createdAt < b.auction.createdAt) {
        return 1;
      }
      return 0;
    }
  } else {
    if (a.forSaleAt > b.forSaleAt) {
      return -1;
    }
    if (a.forSaleAt < b.forSaleAt) {
      return 1;
    }
    return 0;
  }
};
export const orderByOldestListed = (a, b) => {
  if (a.auction || b.auction) {
    if (a.auction && !b.auction) {
      if (a.auction.createdAt < b.forSaleAt) {
        return -1;
      }
      if (a.auction.createdAt > b.forSaleAt) {
        return 1;
      }
      return 0;
    }
    if (!a.auction && b.auction) {
      if (a.forSaleAt < b.auction.createdAt) {
        return -1;
      }
      if (a.forSaleAt > b.auction.createdAt) {
        return 1;
      }
      return 0;
    }
    if (a.auction && b.auction) {
      if (a.auction.createdAt < b.auction.createdAt) {
        return -1;
      }
      if (a.auction.createdAt > b.auction.createdAt) {
        return 1;
      }
      return 0;
    }
  } else {
    if (a.forSaleAt < b.forSaleAt) {
      return -1;
    }
    if (a.forSaleAt > b.forSaleAt) {
      return 1;
    }
    return 0;
  }
};
export const orderByLowestP = (a, b) => {
  if (a.offer || b.offer) {
    if (a.offer && !b.offer) {
      if (b.auction) {
        if (b.auction.topBid) {
          if (a.offer.price < b.auction.topBid) {
            return -1;
          }
          if (a.offer.price > b.auction.topBid) {
            return 1;
          }
          return 0;
        } else {
          if (a.offer.price < b.auction.bid) {
            return -1;
          }
          if (a.offer.price > b.auction.bid) {
            return 1;
          }
          return 0;
        }
      } else {
        if (a.offer.price < b.price) {
          return -1;
        }
        if (a.offer.price > b.price) {
          return 1;
        }
        return 0;
      }
    }
    if (!a.offer && b.offer) {
      if (a.auction) {
        if (a.auction.topBid) {
          if (a.auction.topBid < b.offer.price) {
            return -1;
          }
          if (a.auction.topBid > b.offer.price) {
            return 1;
          }
          return 0;
        } else {
          if (a.auction.bid < b.offer.price) {
            return -1;
          }
          if (a.auction.bid > b.offer.price) {
            return 1;
          }
          return 0;
        }
      } else {
        if (a.price < b.offer.price) {
          return -1;
        }
        if (a.price > b.offer.price) {
          return 1;
        }
        return 0;
      }
    }
    if (a.offer && b.offer) {
      if (a.offer.price < b.offer.price) {
        return -1;
      }
      if (a.offer.price > b.offer.price) {
        return 1;
      }
      return 0;
    }
  } else if (a.auction || b.auction) {
    if (a.auction && !b.auction) {
      if (a.auction.topBid) {
        if (a.auction.topBid < b.price) {
          return -1;
        }
        if (a.auction.topBid > b.price) {
          return 1;
        }
        return 0;
      } else {
        if (a.auction.bid < b.price) {
          return -1;
        }
        if (a.auction.bid > b.price) {
          return 1;
        }
        return 0;
      }
    }
    if (!a.auction && b.auction) {
      if (b.auction.topBid) {
        if (a.price < b.auction.topBid) {
          return -1;
        }
        if (a.price > b.auction.topBid) {
          return 1;
        }
        return 0;
      } else {
        if (a.price < b.auction.bid) {
          return -1;
        }
        if (a.price > b.auction.bid) {
          return 1;
        }
        return 0;
      }
    }
    if (a.auction && b.auction) {
      if (a.auction.topBid && !b.auction.topBid) {
        if (a.auction.topBid < b.auction.bid) {
          return -1;
        }
        if (a.auction.topBid > b.auction.bid) {
          return 1;
        }
        return 0;
      }
      if (!a.auction.topBid && b.auction.topBid) {
        if (a.auction.bid < b.auction.topBid) {
          return -1;
        }
        if (a.auction.bid > b.auction.topBid) {
          return 1;
        }
        return 0;
      }
      if (!a.auction.topBid && !b.auction.topBid) {
        if (a.auction.bid < b.auction.bid) {
          return -1;
        }
        if (a.auction.bid > b.auction.bid) {
          return 1;
        }
        return 0;
      }
      if (a.auction.topBid && a.auction.topBid) {
        if (a.auction.topBid < b.auction.topBid) {
          return -1;
        }
        if (a.auction.topBid > b.auction.topBid) {
          return 1;
        }
        return 0;
      }
    }
  } else {
    if (a.price < b.price) {
      return -1;
    }
    if (a.price > b.price) {
      return 1;
    }
    return 0;
  }
};
export const orderByHighestP = (a, b) => {
  if (a.offer || b.offer) {
    if (a.offer && !b.offer) {
      if (b.auction) {
        if (b.auction.topBid) {
          if (a.offer.price > b.auction.topBid) {
            return -1;
          }
          if (a.offer.price < b.auction.topBid) {
            return 1;
          }
          return 0;
        } else {
          if (a.offer.price > b.auction.bid) {
            return -1;
          }
          if (a.offer.price < b.auction.bid) {
            return 1;
          }
          return 0;
        }
      } else {
        if (a.offer.price > b.price) {
          return -1;
        }
        if (a.offer.price < b.price) {
          return 1;
        }
        return 0;
      }
    }
    if (!a.offer && b.offer) {
      if (a.auction) {
        if (a.auction.topBid) {
          if (a.auction.topBid > b.offer.price) {
            return -1;
          }
          if (a.auction.topBid < b.offer.price) {
            return 1;
          }
        } else {
          if (a.auction.bid > b.offer.price) {
            return -1;
          }
          if (a.auction.bid < b.offer.price) {
            return 1;
          }
        }
      } else {
        if (a.price > b.offer.price) {
          return -1;
        }
        if (a.price < b.offer.price) {
          return 1;
        }
        return 0;
      }
    }
    if (a.offer && b.offer) {
      if (a.offer.price > b.offer.price) {
        return -1;
      }
      if (a.offer.price < b.offer.price) {
        return 1;
      }
      return 0;
    }
  } else if (a.auction || b.auction) {
    if (a.auction && !b.auction) {
      if (a.auction.topBid) {
        if (a.auction.topBid > b.price) {
          return -1;
        }
        if (a.auction.topBid < b.price) {
          return 1;
        }
        return 0;
      } else {
        if (a.auction.bid > b.price) {
          return -1;
        }
        if (a.auction.bid < b.price) {
          return 1;
        }
        return 0;
      }
    }
    if (!a.auction && b.auction) {
      if (b.auction.topBid) {
        if (a.price > b.auction.topBid) {
          return -1;
        }
        if (a.price < b.auction.topBid) {
          return 1;
        }
        return 0;
      } else {
        if (a.price > b.auction.bid) {
          return -1;
        }
        if (a.price < b.auction.bid) {
          return 1;
        }
        return 0;
      }
    }
    if (a.auction && b.auction) {
      if (a.auction.topBid && !b.auction.topBid) {
        if (a.auction.topBid > b.auction.bid) {
          return -1;
        }
        if (a.auction.topBid < b.auction.bid) {
          return 1;
        }
        return 0;
      }
      if (!a.auction.topBid && b.auction.topBid) {
        if (a.auction.bid > b.auction.topBid) {
          return -1;
        }
        if (a.auction.bid < b.auction.topBid) {
          return 1;
        }
        return 0;
      }
      if (!a.auction.topBid && !b.auction.topBid) {
        if (a.auction.bid > b.auction.bid) {
          return -1;
        }
        if (a.auction.bid < b.auction.bid) {
          return 1;
        }
        return 0;
      }
      if (a.auction.topBid && a.auction.topBid) {
        if (a.auction.topBid > b.auction.topBid) {
          return -1;
        }
        if (a.auction.topBid < b.auction.topBid) {
          return 1;
        }
        return 0;
      }
    }
  } else {
    if (a.price > b.price) {
      return -1;
    }
    if (a.price < b.price) {
      return 1;
    }
    return 0;
  }
};

export const orderByNearestEnd = (a, b) => {
  if (a.auction.endTime < b.auction.endTime) {
    return -1;
  }
  if (a.auction.endTime > b.auction.endTime) {
    return 1;
  }
  return 0;
};
