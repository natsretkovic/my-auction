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

  
  /*loadAuctions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadAuctions),
      mergeMap(() =>
        this.auctionService.getAuctions().pipe(
          map(auctions => AuctionActions.loadAuctionsSuccess({ auctions })),
          catchError(err => of(AuctionActions.loadAuctionsFailure({ error: err.message })))
        )
      )
    )
  );*/

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
}
