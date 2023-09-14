import sys

from utils.constants import MODELS_NAMES

ARGS_DEFAULT = { 
    'data', 'train', 
    'embed', 'embed_news', 'embed_users', 
    'cats', 'profiles', 
    'viz', 'viz_news', 'viz_users'
}


if __name__ == "__main__":

    args = set(sys.argv[1:])
    if not args:
        args = ARGS_DEFAULT        

    if 'embed' in args:
        args.remove('embed')
        args = args.union({ 'embed_news', 'embed_users' })
    if 'viz' in args:
        args.remove('viz')
        args = args.union({ 'viz_news', 'viz_users' })

    nb_args = len(args.intersection(ARGS_DEFAULT))
    step = 1


    # Download data
    if 'data' in args:    
        print(f'({step}/{nb_args}) Downloading data..')

        from recommenders.models.deeprec.deeprec_utils import \
            download_deeprec_resources
        from recommenders.models.newsrec.newsrec_utils import get_mind_data_set

        from utils.paths import PATH_TO_TEST, PATH_TO_TRAIN, PATH_TO_UTILS

        mind_url, mind_train_dataset, mind_dev_dataset, mind_utils = get_mind_data_set('demo')
        download_deeprec_resources(mind_url, PATH_TO_TRAIN, mind_train_dataset)
        download_deeprec_resources(mind_url, PATH_TO_TEST, mind_dev_dataset)
        download_deeprec_resources(mind_url, PATH_TO_UTILS, mind_utils)
        step += 1


    # Train blackbox model
    if 'train' in args:
        print(f'({step}/{nb_args}) Training blackbox model..')

        from models.blackbox.model import BlackBoxModel
        model = BlackBoxModel()
        model.fit_weights()
        model.save()
        step += 1


    # Embed news
    if 'embed_news' in args:
        print(f'({step}/{nb_args}) Embedding news..')

        from build.embeddings.news.embed import build as build_news
        build_news()
        step += 1

    # Embed users
    if 'embed_users' in args:
        print(f'({step}/{nb_args}) Embedding users..')

        from build.embeddings.users.embed import build as build_users
        build_users()
        step += 1


    # Build cat/subcat hierarchy
    if 'cats' in args:
        print(f'({step}/{nb_args}) Building cat/subcat hierarchy..')
        from build.categories import build as build_categories
        build_categories()
        step += 1


    # Build profiles history
    if 'profiles' in args:
        print(f'({step}/{nb_args}) Building default profiles..')
        from build.profiles import build as build_profiles
        build_profiles()
        step += 1


    # Build news visualization
    if 'viz_news' in args:
        print(f'({step}/{nb_args}) Building news visualizations..')
        from build.visualization import build as build_visualization

        for model_name in MODELS_NAMES:
            build_visualization('news', model_name)
        step += 1

    # Build users visualization
    if 'viz_users' in args:
        print(f'({step}/{nb_args}) Building users visualization..')
        # To not import again the same function
        if not 'viz_news' in args:
            from build.visualization import build as build_visualization

        for model_name in MODELS_NAMES:
            build_visualization('users', model_name)

    
    print('Done!')
