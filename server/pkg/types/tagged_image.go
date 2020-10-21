package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type TaggedImage struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Image    string             `json:"image" bson:"image"`
	IsTagged bool               `json:"isTagged" bson:"isTagged"`
	Tags     []string           `json:"tags" bson:"tags"`
}
