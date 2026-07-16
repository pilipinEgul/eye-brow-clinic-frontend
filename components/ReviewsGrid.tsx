"use client";

import { useState, type ReactNode } from "react";

const INITIAL = 3; // cards shown before "See more"
const STEP = 3; // how many more each click reveals

/**
 * Progressive reveal for the Google review cards: shows a few, then a
 * "See more reviews" button that reveals more each click until all are shown
 * (then flips to "Show less"). Cards are rendered on the server and passed in
 * as `cards` — revealing is instant, no refetch.
 */
export function ReviewsGrid({ cards }: { cards: ReactNode[] }) {
  const [visible, setVisible] = useState(Math.min(INITIAL, cards.length));
  const allShown = visible >= cards.length;

  return (
    <>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.slice(0, visible)}
      </div>

      {cards.length > INITIAL ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisible((v) =>
                allShown ? Math.min(INITIAL, cards.length) : Math.min(v + STEP, cards.length),
              )
            }
            aria-expanded={allShown}
            className="btn btn-secondary"
          >
            {allShown ? "Show less" : `See more reviews (${cards.length - visible})`}
          </button>
        </div>
      ) : null}
    </>
  );
}
