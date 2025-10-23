import { Injectable,inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuctionService } from '../../services/auction.service';
import * as AuctionActions from './auction.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuctionEffects {
  private actions$: Actions = inject(Actions);
  private auctionService: AuctionService = inject(AuctionService);
  constructor(/*private actions$: Actions, private auctionService: AuctionService,private router: Router*/) {}

  addAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.addAuction),
      mergeMap(action =>
        this.auctionService.addAuction(action.auction).pipe(
          map(auction => AuctionActions.addAuctionSuccess({ auction })),
          catchError(err => of(AuctionActions.addAuctionFailure({ error: err.message })))
        )
      )
    )
  );
   loadAuctionById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadAuctionById),
      mergeMap(({ id }) =>
        this.auctionService.getAuctionById(id).pipe(
          map(auction => AuctionActions.loadAuctionByIdSuccess({ auction })),
          catchError(error =>
            of(AuctionActions.loadAuctionByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  placeBid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.placeBid),
      mergeMap(({ auctionId, bidAmount }) =>
        this.auctionService.placeBid(auctionId, bidAmount).pipe(
          map(bid => AuctionActions.placeBidSuccess({ bid })),
          catchError(error =>
            of(AuctionActions.placeBidFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
