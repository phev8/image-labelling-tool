package db_client

import (
	"github.com/phev8/image-tagging-server/pkg/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (dbService *DBService) GetImages() (results []types.TaggedImage, err error) {
	ctx, cancel := dbService.getContext()
	defer cancel()

	filter := bson.M{}

	noCursorTimeout := true
	options := options.FindOptions{
		NoCursorTimeout: &noCursorTimeout,
	}
	cur, err := dbService.collectionRef().Find(
		ctx,
		filter,
		&options,
	)

	if err != nil {
		return results, err
	}
	defer cur.Close(ctx)

	results = []types.TaggedImage{}
	for cur.Next(ctx) {
		var result types.TaggedImage
		err := cur.Decode(&result)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	if err := cur.Err(); err != nil {
		return results, err
	}

	return results, nil
}

func (dbService *DBService) SaveImageData(image types.TaggedImage) (types.TaggedImage, error) {
	ctx, cancel := dbService.getContext()
	defer cancel()

	filter := bson.M{
		"image": image.Image,
	}

	if image.Tags == nil {
		image.Tags = make([]string, 0)
	}

	upsert := true
	rd := options.After
	options := options.FindOneAndReplaceOptions{
		Upsert:         &upsert,
		ReturnDocument: &rd,
	}
	elem := types.TaggedImage{}
	err := dbService.collectionRef().FindOneAndReplace(
		ctx, filter, image, &options,
	).Decode(&elem)
	return elem, err
}
