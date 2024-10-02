import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useNftContext } from '../NftProvider';
import { NftVideo } from './NftVideo';

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));

const mockAnimationUrl = 'http://example.com/video.mp4';
const mockImageUrl = 'http://example.com/image.jpg';

describe('NftVideo', () => {
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue({
      animationUrl: mockAnimationUrl,
      imageUrl: mockImageUrl,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render default SVG when no animationUrl is provided', () => {
    (useNftContext as Mock).mockReturnValue({
      animationUrl: null,
      imageUrl: mockImageUrl,
    });

    const { getByRole } = render(<NftVideo />);

    expect(getByRole('img')).toBeInTheDocument();
  });

  it('should render video element when animationUrl is provided', () => {
    const { getByTestId } = render(<NftVideo />);

    expect(getByTestId('ockNftVideo')).toBeInTheDocument();
  });

  it('should call onLoading when video starts loading', () => {
    const onLoading = vi.fn();

    const { getByTestId } = render(<NftVideo onLoading={onLoading} />);

    fireEvent.loadStart(getByTestId('ockNftVideo'));

    expect(onLoading).toHaveBeenCalledWith(mockAnimationUrl);
  });

  it('should call onLoaded when video has loaded', () => {
    const onLoaded = vi.fn();

    const { getByTestId } = render(<NftVideo onLoaded={onLoaded} />);

    fireEvent.loadedData(getByTestId('ockNftVideo'));

    expect(onLoaded).toHaveBeenCalled();
  });

  it('should handle error when video fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NftVideo onError={onError} />);

    fireEvent.error(getByTestId('ockNftVideo'));

    expect(onError).toHaveBeenCalledWith({
      error: 'error',
      code: 'NmNVc01',
      message: 'Error loading video',
    });
  });

  it('should handle string error when video fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NftVideo onError={onError} />);

    getByTestId('ockNftVideo').onerror?.('string error');

    expect(onError).toHaveBeenCalledWith({
      error: 'string error',
      code: 'NmNVc01',
      message: 'Error loading video',
    });
  });
});
