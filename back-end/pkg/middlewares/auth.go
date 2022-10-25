package middlewares

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"

	"github.com/angshumanHalder/potential-pancake/pkg/services"
	"github.com/angshumanHalder/potential-pancake/pkg/utils"
)

type contextKey int

const userEmail contextKey = 0

func AuthMiddleware(db *mongo.Database, next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, err := utils.TokenValid(db, r)
		if err != nil {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}
		email, ok := claims["email"].(string)
		if !ok {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}
		user, err := services.GetUser(db, email)
		if err != nil {
			http.Error(w, "User not found with associated token", http.StatusUnauthorized)
			return
		}
		ctxWithUser := context.WithValue(r.Context(), userEmail, user)
		rWithUser := r.WithContext(ctxWithUser)
		next.ServeHTTP(w, rWithUser)
	})
}
