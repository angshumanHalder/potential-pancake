package middlewares

import (
	"context"
	"net/http"

	"github.com/angshumanHalder/potential-pancake/pkg/utils"
)

type contextKey int

const userEmail contextKey = 0

func AuthMiddleware(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, err := utils.TokenValid(r)
		if err != nil {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}
		ctxWithUser := context.WithValue(r.Context(), userEmail, claims["email"].(string))
		rWithUser := r.WithContext(ctxWithUser)
		next.ServeHTTP(w, rWithUser)
	})
}
