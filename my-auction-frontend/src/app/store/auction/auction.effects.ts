import { Injectable,inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuctionService } from '../../services/auction.service';
import * as AuctionActions from './auction.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SocketService } from '../../services/socket.service';
import { Auction } from '../../models/auction.model';

@Injectable()
export class AuctionEffects {
  private actions$: Actions = inject(Actions);
  private auctionService: AuctionService = inject(AuctionService);
  private socketService: SocketService = inject(SocketService);
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
  listenForNewBids$ = createEffect(() =>
        this.socketService.listen<{ auctionId: string, newAuction: Auction }>('newBid').pipe(
            map(data => AuctionActions.bidReceivedFromSocket({ auction: data.newAuction }))
        )
    );
  joinAuctionRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuctionActions.joinAuctionRoom),
            tap(({ auctionId }) => { 
                this.socketService.joinRoom(auctionId);
            })
        ),
        { dispatch: false }
    );

  updateAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.updateAuction),
      switchMap(action =>
        this.auctionService.updateAuction(action.auctionId, action.data).pipe(
          map(auction => {
             alert('Aukcija uspešno ažurirana!');
             return AuctionActions.updateAuctionSuccess({ auction });
          }),
          catchError(error => of(AuctionActions.updateAuctionFailure({ error })))
        )
      )
    )
  );

  deleteAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.deleteAuction),
      switchMap(action =>
        this.auctionService.deleteAuction(action.auctionId).pipe(
          map(() => AuctionActions.deleteAuctionSuccess({ auctionId: action.auctionId })), 
          catchError(error => of(AuctionActions.deleteAuctionFailure({ error })))
        )
      )
    )
  );
}
